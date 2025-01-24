const multer = require('multer');
const path = require('path');

const constants = require('../config/constants.json');

const { hypheniseFileName } = require('./common');

// Set up multer storage configuration
function getMulterStorageInstance() {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(constants.app.outputDirectory, '/')); // Set destination folder
    },
    filename: function (req, file, cb) {
      // Save file with original filename, or customize this if needed
      cb(null, `${Date.now()}-${hypheniseFileName(file.originalname)}`);
    },
  });
}

function getMulterUploadInstance() {
  return multer({
    storage: getMulterStorageInstance(),
    limits: { fileSize: constants.ffmpeg.maxSize * 1024 * 1024 }, // Set a limit (25 MB for example)
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!constants.app.allowedFileExtensions.includes(ext)) {
        // Instead of generic Error, pass an object with more details
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.originalname));
      }
      cb(null, true);
    },
  });
}

exports.MulterUtil = {
  upload: getMulterUploadInstance(),
};
