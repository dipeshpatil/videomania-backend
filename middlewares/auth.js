const jwt = require("jsonwebtoken");

const { appConfig } = require("../config/secrets");

const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No Token, Authorization Denied!" });
  }
  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(403).json({ message: `Invalid Token! ${err.message}` });
  }
};

module.exports = {
  authenticateToken,
};
