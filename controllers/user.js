const { validationResult } = require("express-validator");

const User = require("../models/user");

const { getUniqueElements } = require("../utils/common");

class UserController {
  constructor() {}

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

      switch (operation) {
        case "add":
          userPermissions = this.#addPermission(permission);
          break;
        case "remove":
          userPermissions = this.#removePermissions(permission);
          break;
      }

      userPermissions = getUniqueElements(userPermissions);
      await User.updateOne(
        { _id: userId },
        { $set: { permissions: userPermissions } }
      );

      res.status(200).json({ msg: "Permissions Updated!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  #addPermission(permission) {}

  #removePermissions(permission) {}

  #replacePermissions(permission = []) {}
}

module.exports = UserController;
