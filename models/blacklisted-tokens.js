const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    credits: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set the timestamp when the token is blacklisted
    },
  },
  { collection: "blacklisted-tokens" }
);

module.exports = BlacklistedToken = mongoose.model(
  "blacklisted-tokens",
  blacklistedTokenSchema
);
