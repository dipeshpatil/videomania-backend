const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user");
const user = new UserController();

const {
  basicPermissionsRequiredValidator,
  basicRoleRequiredValidator,
} = require("../validators/user");

const { authenticateToken, authoriseRole } = require("../middlewares/auth");
const { USER, ADMIN } = require("../enums/user");

/**
 * @route   GET /user/role/:userId
 * @desc    Get roles for user
 * @access  Private (anyone with user role can do it)
 */
router.get(
  "/role/:userId",
  [authenticateToken, authoriseRole(USER)],
  user.getRole.bind(user)
);

/**
 * @route   PUT /user/role/:userId
 * @desc    Update user role for user
 * @access  Private (user with admin role can do it)
 * @body    { role: <string> }
 */
router.put(
  "/role/:userId",
  [authenticateToken, authoriseRole(ADMIN), basicRoleRequiredValidator],
  user.updateRole.bind(user)
);

/**
 * @route   GET /user/permission/:userId
 * @desc    Get video permissions for user
 * @access  Private (anyone with admin role can do it)
 */
router.get(
  "/permission/:userId",
  [authenticateToken, authoriseRole(USER)],
  user.getPermissions.bind(user)
);

/**
 * @route   PUT /user/permission/:userId
 * @desc    Update video permissions for user
 * @access  Private (anyone with admin role can do it)
 * @body    { permissions: <string>, operation: <string> }
 */
router.put(
  "/permission/:userId",
  [authenticateToken, authoriseRole(ADMIN), basicPermissionsRequiredValidator],
  user.updatePermission.bind(user)
);

module.exports = router;
