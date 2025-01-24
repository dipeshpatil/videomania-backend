const express = require('express');

const router = express.Router();

const { MulterUtil } = require('../utils/multer');
const VideoController = require('../controllers/video');

const { authenticateToken, authoriseRole } = require('../middlewares/auth');
const { authorizePermission, checkCredits } = require('../middlewares/video');

const { videoPermissions, planCredits } = require('../enums/video');
const { USER, ADMIN } = require('../enums/user');

const {
  basicVideoTrimValidator,
  basicMergeValidator,
  basicShareValidator,
  basicRenameVideoValidator,
} = require('../validators/video');

const videoController = new VideoController();

/**
 * @route   POST /upload
 * @desc    Upload a video file with size and duration validation
 * @access  Private (requires static API token)
 * @body    { file: <file> }  // Example: { "file": <video file> }
 */
router.post(
  '/upload',
  [
    authenticateToken,
    authoriseRole(USER),
    authorizePermission(videoPermissions.UPLOAD),
    checkCredits(planCredits.UPLOAD),
    MulterUtil.upload.single('file'),
  ],
  videoController.uploadVideo
);

/**
 * @route   POST /trim/:videoId
 * @desc    Trim a previously uploaded video by adjusting the start or end times
 * @access  Private (requires static API token)
 * @body    { start: <number>, end: <number> }  // Example: { "start": 5, "end": 60 }
 */
router.post(
  '/trim/:videoId',
  [
    authenticateToken,
    authoriseRole(USER),
    authorizePermission(videoPermissions.TRIM),
    checkCredits(planCredits.TRIM),
    basicVideoTrimValidator,
  ],
  videoController.trimVideo
);

/**
 * @route   POST /merge
 * @desc    Merge multiple previously uploaded video clips into a single video
 * @access  Private (requires static API token)
 * @body    { videoIds: [<number>] }  // Example: { "videoIds": [1, 2, 3] }
 */
router.post(
  '/merge',
  [
    authenticateToken,
    authoriseRole(USER),
    authorizePermission(videoPermissions.MERGE),
    checkCredits(planCredits.MERGE),
    basicMergeValidator,
  ],
  videoController.mergeVideos
);

/**
 * @route   POST /share/:videoId
 * @desc    Generate a time-limited shareable link for a previously uploaded video, With specifying optional expiryDuration in minutes. Default is 10 mins.
 * @access  Private (requires static API token)
 * @body    { expiryDuration: <number> }  // Example: { "expiryDuration": 30 }
 */
router.post(
  '/share/:videoId',
  [
    authenticateToken,
    authoriseRole(USER),
    authorizePermission(videoPermissions.SHARE),
    checkCredits(planCredits.SHARE),
    basicShareValidator,
  ],
  videoController.generateShareLink
);

/**
 * @route   GET /share/:link
 * @desc    Access a shared video using a time-limited shareable link
 * @access  Private (requires static API token)
 * @body    None
 */
router.get(
  '/share/:link',
  [
    authenticateToken,
    authoriseRole(USER),
    authorizePermission(videoPermissions.SHARE),
    checkCredits(planCredits.SHARE),
  ],
  videoController.shareVideoLink
);

/**
 * @route   PUT video/rename/:videoId
 * @desc    Renames an existing video title
 * @access  Private (requires static API token)
 * @body    { videoName: <string> }
 */
router.put(
  '/rename/:videoId',
  [authenticateToken, authoriseRole(USER), basicRenameVideoValidator],
  videoController.renameVideoTitle
);

/**
 * @route   GET video/:videoId
 * @desc    Get a videoURL
 * @access  Private (requires static API token)
 * @body    None
 */
router.get('/:videoId', [authenticateToken, authoriseRole(USER)], videoController.getVideoURL);

/**
 * @route   DELETE video/:videoId
 * @desc    Delete a video
 * @access  Private (requires static API token)
 * @body    None
 */
router.delete('/:videoId', [authenticateToken, authoriseRole(USER)], videoController.deleteVideo);

module.exports = router;
