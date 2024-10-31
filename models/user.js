const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    permissions: {
      type: [String],
      default: ["upload"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { collection: "users" }
);

module.exports = User = mongoose.model("users", UserSchema);
