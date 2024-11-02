const BlacklistedToken = require("../models/blacklisted-tokens");

const checkBlacklistedToken = async (req, res, next) => {
  try {
    const token = await BlacklistedToken.findOne({ token: req.body.token });
    if (!token) next();
    else res.status(400).json({ error: "Token is Blacklisted!" });
  } catch (error) {
    res.status(400).json({ error: "Token is Blacklisted!!" });
  }
};

module.exports = {
  checkBlacklistedToken,
};
