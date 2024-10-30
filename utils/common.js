const { ShareableLink } = require("../models/share-link");

function hypheniseFileName(fileName) {
  return fileName.toLowerCase().replace(/\s+/g, "-");
}

function getUniqueElements(arr) {
  return [...new Set(arr)];
}

async function cleanUpExpiredLinks() {
  try {
    const result = await ShareableLink.deleteMany({
      expiryTime: { $lt: new Date() },
    });
    console.log(`Number of expired links deleted: ${result.deletedCount}`);
  } catch (error) {
    console.log("Error deleting expired rows:", error);
  }
}

module.exports = {
  hypheniseFileName,
  getUniqueElements,
  cleanUpExpiredLinks,
};
