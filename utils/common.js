function hypheniseFileName(fileName) {
  return fileName.toLowerCase().replace(/\s+/g, "-");
}

function getUniqueElements(arr) {
  return [...new Set(arr)];
}

module.exports = {
  hypheniseFileName,
  getUniqueElements,
};
