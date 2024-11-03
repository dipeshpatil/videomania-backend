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
  },
  { collection: "blacklisted-tokens" }
);

module.exports = BlacklistedToken = mongoose.model(
  "blacklisted-tokens",
  blacklistedTokenSchema
);
