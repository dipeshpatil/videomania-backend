const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!requiredPermission) {
      return res
        .status(400)
        .json({ message: "Access Denied -- No Permission Specified!" });
    }

    const userRole = req.user.role;
    // Bypass For Admin
    if (userRole === "admin") next();
    else {
      const userPermissions = req.user.permissions;

      if (userPermissions.includes(requiredPermission)) {
        next();
      } else {
        res.status(403).json({
          message: `Access Denied -- Insufficient Permissions: ${requiredPermission}`,
        });
      }
    }
  };
};

module.exports = {
  authorizePermission,
};
