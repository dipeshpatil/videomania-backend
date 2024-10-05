const Video = require("../models/video");

class VideoController {
  constructor() {
    this.urlBucket = {};
    this.urlAnalyticsBucket = {};
  }

  async greet(req, res) {
    return res.send("Video Route");
  }

  async uploadVideo(req, res) {
    try {
      Video.create({
        title: "1.mp4",
        filePath: "dhcdc",
        size: "1mb",
        duration: "5s",
      })
        .then((video) => res.status(201).json(video))
        .catch((error) => res.status(500).json({ error }));
    } catch (error) {
      res.status(500).json({ error: "Error uploading video" });
    }
  }

  async trimVideo(req, res) {}

  async mergeVideos(req, res) {}

  async shareVideoLink(req, res) {}

  async getAllVideos(req, res) {
    try {
      const videos = await Video.findAll();
      res.status(200).json(videos);
    } catch (err) {
      res.status(500).json({ error: "Error fetching videos" });
    }
  }
}

module.exports = VideoController;
