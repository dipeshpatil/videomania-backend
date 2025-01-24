const { ADMIN } = require('../enums/user');

const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!requiredPermission) {
      return res.status(400).json({ message: 'Access Denied -- No Permission Specified!' });
    }

    const userRole = req.user.role;
    // Bypass For Admin
    if (userRole === ADMIN) {next();}
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

const checkCredits = (requiredCredits) => {
  return async (req, res, next) => {
    const userCredits = req.user.credits;
    if (userCredits >= requiredCredits) {
      next();
    } else {
      res.status(429).json({ error: 'Insufficient Credits!' });
    }
  };
};

module.exports = {
  authorizePermission,
  checkCredits,
};
