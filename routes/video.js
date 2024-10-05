const express = require("express");

const router = express.Router();

const { MulterUtil } = require("../utils/multer");
const VideoController = require("../controllers/video");

const videoController = new VideoController();

router.post(
  "/upload",
  MulterUtil.upload.single("file"),
  videoController.uploadVideo
);

router.post("/trim/:videoId", videoController.trimVideo);

router.get("/merge", videoController.greet);

router.post("/share/:videoId", videoController.generateShareLink);

router.get("/share/:link", videoController.shareVideoLink);

router.get("/all", videoController.getAllVideos);

router.get("/all-links", videoController.getAllLinks);

module.exports = router;
