const { Op, Sequelize } = require("sequelize");
const ShareableLink = require("../models/share-link");

function hypheniseFileName(fileName) {
  return fileName.toLowerCase().replace(/\s+/g, "-");
}

function getUniqueElements(arr) {
  return [...new Set(arr)];
}

async function cleanUpExpiredLinks() {
  try {
    const deletedRowsCount = await ShareableLink.destroy({
      where: {
        expiryTime: {
          [Op.lt]: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
    });
    console.log(`Number of expired links deleted: ${deletedRowsCount}`);
  } catch (error) {
    console.log("Error deleting expired rows:", error);
  }
}

module.exports = {
  hypheniseFileName,
  getUniqueElements,
  cleanUpExpiredLinks,
};
