const express = require("express");

const router = express.Router();

const { MulterUtil } = require("../utils/multer");
const VideoController = require("../controllers/video");

const { authenticateToken } = require("../middlewares/auth");

const {
  basicVideoTrimValidator,
  basicMergeValidator,
  basicShareValidator,
} = require("../validators/video");

const videoController = new VideoController();

/**
 * @route   POST /upload
 * @desc    Upload a video file with size and duration validation
 * @access  Private (requires static API token)
 */
router.post(
  "/upload",
  [authenticateToken, MulterUtil.upload.single("file")],
  videoController.uploadVideo
);

/**
 * @route   POST /trim/:videoId
 * @desc    Trim a previously uploaded video by adjusting the start or end times
 * @access  Private (requires static API token)
 */
router.post(
  "/trim/:videoId",
  [authenticateToken, basicVideoTrimValidator],
  videoController.trimVideo
);

/**
 * @route   POST /merge
 * @desc    Merge multiple previously uploaded video clips into a single video
 * @access  Private (requires static API token)
 */
router.post(
  "/merge",
  [authenticateToken, basicMergeValidator],
  videoController.mergeVideos
);

/**
 * @route   POST /share/:videoId
 * @desc    Generate a time-limited shareable link for a previously uploaded video
 * @access  Private (requires static API token)
 */
router.post(
  "/share/:videoId",
  [authenticateToken, basicShareValidator],
  videoController.generateShareLink
);

/**
 * @route   GET /share/:link
 * @desc    Access a shared video using a time-limited shareable link
 * @access  Private (requires static API token)
 */
router.get("/share/:link", [authenticateToken], videoController.shareVideoLink);

// debug routes to see data in database
router.get("/all", [authenticateToken], videoController.getAllVideos);
router.get("/all-links", [authenticateToken], videoController.getAllLinks);

module.exports = router;
