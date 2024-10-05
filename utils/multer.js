const multer = require("multer");
const path = require("path");

const { hypheniseFileName } = require("./common");

// Set up multer storage configuration
function getMulterStorage() {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Set destination folder
    },
    filename: function (req, file, cb) {
      // Save file with original filename, or customize this if needed
      cb(null, `${Date.now()}-${hypheniseFileName(file.originalname)}`);
    },
  });
}

function getMulterUploadInstance() {
  return multer({
    storage: getMulterStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // Set a limit (25 MB for example)
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== ".mp4") {
        return cb(new Error("Only MP4 files are allowed"));
      }
      cb(null, true);
    },
  });
}

exports.MulterUtil = {
  upload: getMulterUploadInstance(),
};
