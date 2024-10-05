const express = require("express");

const VideoController = require("../controllers/video");

const router = express.Router();

const videoController = new VideoController();

router.get("/", videoController.greet.bind(videoController));

router.get("/upload", videoController.greet.bind(videoController));

router.get("/trim/:videoId", videoController.greet.bind(videoController));

router.get("/merge", videoController.greet.bind(videoController));

router.get("/share/:videoId", videoController.greet.bind(videoController));

module.exports = router;
