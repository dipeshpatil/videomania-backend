const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // Size in bytes
      required: true,
    },
    duration: {
      type: Number, // Duration in seconds
      required: true,
    },
    s3VideoKey: {
      type: String,
      required: true,
    },
    s3BucketName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
  },
  { collection: 'videos' }
);

module.exports = {
  Video: mongoose.model('videos', videoSchema),
};
