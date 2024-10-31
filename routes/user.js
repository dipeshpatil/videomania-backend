const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user");
const user = new UserController();

const { basicPermissionsRequiredValidator } = require("../validators/user");

/**
 * @route   PUT /user/permission
 * @desc    Update video permissions for user
 * @access  Private (anyone with admin role can do it)
 * @body    { permissions: <[string]> }
 */
router.put(
  "/permission/:userId",
  basicPermissionsRequiredValidator,
  user.updatePermission.bind(user)
);

module.exports = router;
