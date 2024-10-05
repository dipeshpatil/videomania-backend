const config = require("../config/constants.json");

class VideoController {
  constructor() {
    this.urlBucket = {};
    this.urlAnalyticsBucket = {};
  }

  async greet(req, res) {
    return res.send("Video Route");
  }

  async uploadVideo(req, res) {}

  async trimVideo(req, res) {}

  async mergeVideos(req, res) {}

  async shareVideoLink(req, res) {}
}

module.exports = VideoController;
