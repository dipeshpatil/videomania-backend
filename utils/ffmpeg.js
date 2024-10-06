const ffmpeg = require("fluent-ffmpeg");

function getVideoDimensions(filepath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) {
        return reject(`Error retrieving video dimensions: ${err.message}`);
      }
      // Extract the width and height from the first video stream
      const videoStream = metadata.streams[0];
      if (videoStream) {
        const width = videoStream.width;
        const height = videoStream.height;
        resolve({ width, height });
      } else {
        reject("No video stream found in the file.");
      }
    });
  });
}

function getVideoDuration(filepath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) {
        return reject(`Error retrieving video duration: ${err.message}`);
      }
      // Extract the video duration from the metadata
      const videoDuration = metadata.format.duration;
      if (videoDuration) {
        resolve(videoDuration);
      } else {
        reject("No video stream found in the file.");
      }
    });
  });
}

module.exports = {
  getVideoDimensions,
  getVideoDuration,
};
