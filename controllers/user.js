const { validationResult } = require("express-validator");

const User = require("../models/user");
const { Video } = require("../models/video");
const { ShareableLink } = require("../models/share-link");

const { getUniqueElements } = require("../utils/common");

class UserController {
  constructor() {}

  async getPermissions(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found!" });
      return res.status(200).json({ permissions: user.permissions });
    } catch (error) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }

  async updatePermission(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { permission, operation } = req.body;
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      let userPermissions = user.permissions;

      if (operation === "add" && userPermissions.includes(permission)) {
        return res.status(400).json({ msg: "Permisson Already Granted!" });
      } else if (
        operation === "remove" &&
        !userPermissions.includes(permission)
      ) {
        return res.status(400).json({ msg: "Permisson Doesn't Exist!" });
      }

      switch (operation) {
        case "add":
          userPermissions = this.#addPermission(userPermissions, permission);
          break;
        case "remove":
          userPermissions = this.#removePermissions(
            userPermissions,
            permission
          );
          break;
        default:
          return res.status(400).json({ msg: "Invalid Operation!" });
      }

      userPermissions = getUniqueElements(userPermissions);

      await User.updateOne(
        { _id: userId },
        { $set: { permissions: userPermissions } }
      );

      return res
        .status(200)
        .json({ msg: "Permissions Updated!", permissons: userPermissions });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }

  async getRole(req, res) {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found!" });
      return res.status(200).json({ role: user.role });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }

  async updateRole(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const { userId } = req.params;

    try {
      await User.updateOne({ _id: userId }, { $set: { role } });

      return res.status(200).json({ msg: "Role Updated!", role });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }

  async getUserDetails(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user } = req;
      if (!user) return res.status(404).json({ msg: "User not found!" });
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }

  async getUserVideos(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user } = req;
      if (!user) return res.status(404).json({ msg: "User not found!" });

      const userId = user.id;
      const videos = await Video.find({ user: userId });

      return res.status(200).json({ videos });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }

  async getUserLinks(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user } = req;
      if (!user) return res.status(404).json({ msg: "User not found!" });

      const userId = user.id;
      const links = await ShareableLink.find({ user: userId }).populate(
        "videoId",
        "_id s3VideoKey s3BucketName title"
      );

      return res.status(200).json({ links });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }

  #addPermission(permissions, permission) {
    permissions.push(permission);
    return permissions;
  }

  #removePermissions(permissions, permission) {
    return permissions.filter((p) => p !== permission);
  }
}

module.exports = UserController;
