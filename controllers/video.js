const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const constants = require("../config/constants.json");
const { s3Config } = require("../config/secrets");
const { Video } = require("../models/video");
const { ShareableLink } = require("../models/share-link");
const { planCredits, videoPermissions } = require("../enums/video");

const { getVideoDimensions, getVideoDuration } = require("../utils/ffmpeg");
const { uploadToS3, downloadFromS3 } = require("../utils/aws-s3");
const { deductUserCredits } = require("../utils/mongo");

const MAX_ALLOWED_FILE_SIZE = constants.ffmpeg.maxSize * 1024 * 1024;
const BUCKET = s3Config.s3BucketName;

class VideoController {
  constructor() {}

  async uploadVideo(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { size, path, originalname } = file;

      if (size > MAX_ALLOWED_FILE_SIZE) {
        return res
          .status(400)
          .json({ error: "File size exceeds the maximum limit" });
      }

      ffmpeg.ffprobe(path, async (err, metadata) => {
        if (err) return res.status(500).json({ error: "Invalid video file" });

        const duration = metadata.format.duration;

        if (
          duration < constants.ffmpeg.minDuration ||
          duration > constants.ffmpeg.maxDuration
        ) {
          fs.unlinkSync(path); // Delete the file if invalid duration
          return res.status(400).json({ error: "Invalid video duration" });
        }

        try {
          const uploadResult = await uploadToS3(
            file.path,
            `uploads/${Date.now()}_${file.originalname}`,
            BUCKET,
            file.mimetype
          );

          // Save video information in the database with S3 URL
          const video = await Video.create({
            title: originalname,
            filePath: uploadResult.Location, // S3 file URL
            size,
            duration,
            s3VideoKey: uploadResult.Key,
            s3BucketName: BUCKET,
          });

          await deductUserCredits(
            req.user.id,
            req.user.credits,
            planCredits.UPLOAD,
            videoPermissions.UPLOAD
          );

          res.status(201).json(video);
        } catch (uploadError) {
          console.log(uploadError);

          res
            .status(500)
            .json({ error: "Failed to upload to S3", msg: uploadError });
        } finally {
          fs.unlinkSync(path); // Clean up local file
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async trimVideo(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { videoId } = req.params;
    const { start, end } = req.body; // Expiry time in minutes

    // Validate start and end times
    const startTime = parseFloat(start);
    const endTime = parseFloat(end);

    if (
      isNaN(startTime) ||
      isNaN(endTime) ||
      startTime < 0 ||
      endTime <= startTime
    ) {
      return res.status(400).json({ error: "Invalid start or end time" });
    }

    try {
      // Check if the video exists
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      const inputKey = video.s3VideoKey; // S3 key of the original video
      const tempDownloadPath = path.join(
        "/tmp",
        `downloaded_${Date.now()}.mp4`
      );
      const tempTrimmedPath = path.join("/tmp", `trimmed_${Date.now()}.mp4`);
      const trimmedFileName = `trimmed_${Date.now()}_${video.title}`;
      const trimmedKey = `trims/${trimmedFileName}`;

      console.log("Downloading video from S3...");
      await downloadFromS3(video.s3BucketName, inputKey, tempDownloadPath);

      console.log("Trimming the video...");
      await new Promise((resolve, reject) => {
        ffmpeg(tempDownloadPath)
          .setStartTime(startTime)
          .setDuration(endTime - startTime)
          .output(tempTrimmedPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      // Step 3: Upload trimmed video back to S3
      console.log("Uploading trimmed video to S3...");
      const uploadResult = await uploadToS3(
        tempTrimmedPath,
        trimmedKey,
        BUCKET,
        "video/mp4"
      );

      // Step 4: Save metadata of trimmed video (optional)
      const newVideo = await Video.create({
        title: trimmedFileName,
        filePath: uploadResult.Location,
        size: fs.statSync(tempTrimmedPath).size,
        duration: endTime - startTime,
        s3BucketName: BUCKET,
        s3VideoKey: trimmedKey,
      });

      await deductUserCredits(
        req.user.id,
        req.user.credits,
        planCredits.TRIM,
        videoPermissions.TRIM
      );

      // Step 5: Clean up temporary files
      fs.unlinkSync(tempDownloadPath);
      fs.unlinkSync(tempTrimmedPath);

      // Respond with the trimmed video metadata
      res.status(200).json(newVideo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async mergeVideos(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { videoIds } = req.body;
      const videos = await Video.find({ _id: { $in: videoIds } });

      if (videos.length !== videoIds.length)
        return res.status(404).json({ error: "One or more videos not found" });

      const s3DownloadPromises = videos.map((video, index) => {
        const tempPath = path.join("/tmp", `video_${index}_${Date.now()}.mp4`);
        return downloadFromS3(video.s3BucketName, video.s3VideoKey, tempPath);
      });

      const tempPaths = await Promise.all(s3DownloadPromises);

      const dimensions = await Promise.all(
        tempPaths.map(async (filePath) => {
          const { width, height } = await getVideoDimensions(filePath);
          return `${width}x${height}`;
        })
      );

      if (new Set(dimensions).size > 1) {
        tempPaths.forEach((p) => fs.unlinkSync(p)); // Cleanup temp files
        return res
          .status(400)
          .json({ error: "Cannot merge videos with different dimensions" });
      }

      // Merge videos using ffmpeg
      const outputFilename = `merged-${Date.now()}.mp4`;
      const tempOutputPath = path.join("/tmp", outputFilename);

      const ffmpegCommand = ffmpeg();
      tempPaths.forEach((filePath) => ffmpegCommand.input(filePath));

      ffmpegCommand
        .on("end", async () => {
          console.log("Merging completed.");

          // Get duration and upload the merged video to S3
          const duration = await getVideoDuration(tempOutputPath);
          const uploadKey = `merges/${outputFilename}`;

          const uploadResult = await uploadToS3(
            tempOutputPath,
            uploadKey,
            BUCKET,
            "video/mp4"
          );

          // Save merged video metadata to DB
          const newVideo = await Video.create({
            title: outputFilename,
            filePath: uploadResult.Location,
            size: fs.statSync(tempOutputPath).size,
            duration,
            s3BucketName: BUCKET,
            s3VideoKey: uploadKey,
          });

          await deductUserCredits(
            req.user.id,
            req.user.credits,
            planCredits.MERGE,
            videoPermissions.MERGE
          );

          // Cleanup temp files
          tempPaths.forEach((p) => fs.unlinkSync(p));
          fs.unlinkSync(tempOutputPath);

          res.status(200).json(newVideo);
        })
        .on("error", (err) => {
          console.error("Error merging videos:", err);
          res.status(500).json({ error: "Error merging videos" });
        })
        .mergeToFile(tempOutputPath);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async generateShareLink(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { videoId } = req.params;
      const { expiryDuration } = req.body; // Expiry time in minutes

      // Check if the video exists
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Generate a unique link
      const link = uuidv4();

      // Calculate the expiration time
      const expiryTime = new Date(
        Date.now() + (expiryDuration || 10) * 60 * 1000
      );

      // Store the shareable link in the database
      const shareableLink = await ShareableLink.create({
        videoId: videoId,
        link: link,
        expiryTime: expiryTime,
      });

      // Generate the shareable URL
      const shareableUrl = `${req.protocol}://${req.get("host")}/video/share/${
        shareableLink.link
      }?token=${process.env.STATIC_TOKEN}`;

      await deductUserCredits(
        req.user.id,
        req.user.credits,
        planCredits.SHARE,
        videoPermissions.SHARE
      );

      res.status(201).json({
        message: "Shareable link generated successfully",
        url: shareableUrl,
        expiresAt: expiryTime,
        link: shareableLink.link,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async shareVideoLink(req, res) {
    try {
      const { link } = req.params;

      // Find the shareable link in the database
      const shareableLink = await ShareableLink.findOne({ link });
      if (!shareableLink) {
        return res.status(404).json({ error: "Invalid or expired link" });
      }

      // Check if the link has expired
      if (new Date() > shareableLink.expiryTime) {
        return res.status(410).json({ error: "Link has expired" });
      }

      // Find the video associated with the link
      const video = await Video.findById(shareableLink.videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      const inputKey = video.s3VideoKey;
      const tempDownloadPath = path.join(
        "/tmp",
        `downloaded_${Date.now()}.mp4`
      );
      console.log("Downloading video from S3...");
      await downloadFromS3(video.s3BucketName, inputKey, tempDownloadPath);

      // Send the video file
      res.sendFile(tempDownloadPath); // Ensure the video file path is correct
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllVideos(req, res) {
    try {
      const videos = await Video.find({});
      res.status(200).json(videos);
    } catch (err) {
      res.status(500).json({ error: "Error fetching videos" });
    }
  }

  async getAllLinks(req, res) {
    try {
      const links = await ShareableLink.find({});
      res.status(200).json(links);
    } catch (err) {
      res.status(500).json({ error: "Error fetching links" });
    }
  }
}

module.exports = VideoController;
