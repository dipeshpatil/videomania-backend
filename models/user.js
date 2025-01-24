const mongoose = require('mongoose');

const {
  planEnum,
  videoPermissions: { UPLOAD, SHARE },
} = require('../enums/video');

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
      default: [UPLOAD, SHARE],
    },
    role: {
      type: String,
      default: 'user',
    },
    plan: {
      type: String,
      enum: Object.keys(planEnum),
      default: planEnum.FREE,
    },
    credits: {
      type: Number,
      default: 100,
    },
  },
  { collection: 'users' }
);

module.exports = User = mongoose.model('users', UserSchema);
