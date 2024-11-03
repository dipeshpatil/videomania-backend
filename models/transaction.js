const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      enum: ["creditDeduction", "creditTopUp"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "transactions" }
);

module.exports = Transaction = mongoose.model(
  "transactions",
  transactionSchema
);
