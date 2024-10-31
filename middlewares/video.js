const User = require("../models/user");

const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!requiredPermission) {
      return res
        .status(400)
        .json({ message: "Access Denied -- No Permission Specified!" });
    }
    const user = await User.findById(req.user.id);
    const userPermissions = user.permissions;

    if (userPermissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({
        message: `Access Denied -- Insufficient Permissions: ${requiredPermission}`,
      });
    }
  };
};

module.exports = {
  authorizePermission,
};
