function hypheniseFileName(fileName) {
  return fileName.toLowerCase().replace(/\s+/g, "-");
}

module.exports = {
  hypheniseFileName,
};
