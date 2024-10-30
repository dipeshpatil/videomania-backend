const mongoose = require("mongoose");

const shareLinkSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "videos",
    },
    link: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
  },
  { collection: "share-links" }
);

module.exports = {
  ShareableLink: mongoose.model("share-links", shareLinkSchema),
};
