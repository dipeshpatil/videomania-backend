// models/video.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import the sequelize instance

// Define the Video model
const Video = sequelize.define(
  "Video",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER, // Size in bytes
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: false,
    },
    s3VideoKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s3BucketName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "videos", // Custom table name if necessary
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

module.exports = Video;
