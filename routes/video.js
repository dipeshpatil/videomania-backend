const express = require("express");

const router = express.Router();

const VideoController = require("../controllers/video");
const {
  MulterUtil: { upload },
} = require("../utils/multer");

const videoController = new VideoController();

router.post(
  "/upload",
  upload.single("file"),
  videoController.uploadVideo.bind(videoController)
);

router.get("/trim/:videoId", videoController.greet.bind(videoController));

router.get("/merge", videoController.greet.bind(videoController));

router.post(
  "/share/:videoId",
  videoController.generateShareLink.bind(videoController)
);

router.get(
  "/share/:link",
  videoController.shareVideoLink.bind(videoController)
);

router.get("/all", videoController.getAllVideos.bind(videoController));

router.get("/all-links", videoController.getAllLinks.bind(videoController));

module.exports = router;
