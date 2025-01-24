const jwt = require('jsonwebtoken');

const { appConfig } = require('../config/secrets');

const { ADMIN } = require('../enums/user');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  const token = req.header('x-auth-token') || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'No Token, Authorization Denied!' });
  }
  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    const user = await User.findById(decoded.user.id).select('-password');
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: 'Invalid Token! JWT Malformed' });
    }
  } catch (err) {
    res.status(401).json({ message: `Invalid Token! ${err.message}` });
  }
};

const authoriseRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    // Bypass For Admin
    if (userRole === ADMIN) {next();}
    else {
      try {
        if (req.user.role === role) {next();}
        else {return res.status(403).json({ message: 'Invalid Role!' });}
      } catch (error) {
        res.status(403).json({ message: `Invalid Role! ${error.message}` });
      }
    }
  };
};

module.exports = {
  authenticateToken,
  authoriseRole,
};
