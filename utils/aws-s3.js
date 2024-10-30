const fs = require("fs");
const AWS = require("aws-sdk");

const { s3Config } = require("../config/secrets");

const s3 = new AWS.S3({
  accessKeyId: s3Config.awsAccessKey,
  secretAccessKey: s3Config.awsSecretAccessKey,
  region: s3Config.awsRegion,
});

async function uploadToS3(filePath, key, bucket, mimeType) {
  const fileStream = fs.createReadStream(filePath);
  const params = {
    Bucket: bucket,
    Key: key, // Unique key for the file
    Body: fileStream,
    ContentType: mimeType || "video/mp4",
  };

  return s3.upload(params).promise(); // Returns a promise
}

async function downloadFromS3(bucket, key, downloadPath) {
  const params = { Bucket: bucket, Key: key };
  const file = fs.createWriteStream(downloadPath);

  return new Promise((resolve, reject) => {
    s3.getObject(params)
      .createReadStream()
      .on("error", (err) => {
        console.error(`Error downloading ${key}:`, err);
        reject(err); // Ensure the promise rejects on error
      })
      .on("end", () => {
        console.log(`Downloaded ${key} to ${downloadPath}`);
        resolve(downloadPath); // Resolve the path correctly
      })
      .pipe(file);
  });
}

module.exports = {
  uploadToS3,
  downloadFromS3,
};
