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

router.post(
  "/upload",
  [authenticateToken, MulterUtil.upload.single("file")],
  videoController.uploadVideo
);

router.post(
  "/trim/:videoId",
  [authenticateToken, basicVideoTrimValidator],
  videoController.trimVideo
);

router.get(
  "/merge",
  [authenticateToken, basicMergeValidator],
  videoController.mergeVideos
);

router.post(
  "/share/:videoId",
  [authenticateToken, basicShareValidator],
  videoController.generateShareLink
);

router.get("/share/:link", [authenticateToken], videoController.shareVideoLink);

// debug routes to see data in database
router.get("/all", [authenticateToken], videoController.getAllVideos);
router.get("/all-links", [authenticateToken], videoController.getAllLinks);

module.exports = router;
