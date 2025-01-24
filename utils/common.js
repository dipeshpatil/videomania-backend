const { ShareableLink } = require('../models/share-link');

function hypheniseFileName(fileName) {
  return fileName.toLowerCase().replace(/\s+/g, '-');
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
    console.log('Error deleting expired rows:', error);
  }
}

async function paginate({
  options = { projection, select, sort, model, populate },
  currentPage,
  limit,
}) {
  try {
    const { projection, select, sort, model, populate = [] } = options;

    currentPage = parseInt(currentPage) || 1;
    limit = parseInt(limit) || 10;
    const startIndex = (currentPage - 1) * limit;

    let query = model
      .find(projection)
      .skip(startIndex)
      .limit(limit)
      .sort(sort || {})
      .select(select || null);

    // Apply multiple populate options dynamically
    if (Array.isArray(populate) && populate.length > 0) {
      populate.forEach((pop) => {
        query = query.populate(pop);
      });
    }

    const [items, totalCount] = await Promise.all([
      query, // Execute the query with all chained populate fields
      model.countDocuments(projection),
    ]);

    return {
      data: items,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNextPage: currentPage * limit < totalCount,
        hasPrevPage: currentPage > 1,
      },
    };
  } catch (error) {
    throw new Error(`Pagination failed: ${error.message}`);
  }
}

module.exports = {
  hypheniseFileName,
  getUniqueElements,
  cleanUpExpiredLinks,
  paginate,
};
