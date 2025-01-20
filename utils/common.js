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

async function paginate({
  options = { model, projection, select, sort },
  currentPage,
  limit,
}) {
  const { projection, select, sort, model } = options;
  const startIndex = (currentPage - 1) * limit;

  const [items, totalCount] = await Promise.all([
    model
      .find(projection)
      .skip(startIndex)
      .limit(limit)
      .sort(sort || null)
      .select(select || null),
    model.countDocuments(projection),
  ]);

  return {
    data: items,
    pagination: {
      currentPage: currentPage,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      hasNextPage: currentPage * limit < totalCount,
      hasPrevPage: currentPage > 1,
    },
  };
}

module.exports = {
  hypheniseFileName,
  getUniqueElements,
  cleanUpExpiredLinks,
  paginate,
};
