const multer = require("multer");
const path = require("path");

const constants = require("../config/constants.json");

const { hypheniseFileName } = require("./common");

// Set up multer storage configuration
function getMulterStorageInstance() {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(constants.app.outputDirectory, "/")); // Set destination folder
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
    limits: { fileSize: 25 * 1024 * 1024 }, // Set a limit (25 MB for example)
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!constants.app.allowedFileExtensions.includes(ext)) {
        return cb(
          new Error(
            `Only ${constants.app.allowedFileExtensions
              .map((e) => e.toUpperCase().slice(1))
              .join(", ")} files are allowed`
          )
        );
      }
      cb(null, true);
    },
  });
}

exports.MulterUtil = {
  upload: getMulterUploadInstance(),
};
