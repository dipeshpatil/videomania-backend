const { isTokenBlacklisted } = require('../utils/redis');

const checkBlacklistedToken = async (req, res, next) => {
  try {
    const tokenExists = await isTokenBlacklisted(req.body.token);
    if (!tokenExists) {next();}
    else {res.status(400).json({ error: 'Token is Blacklisted!' });}
  } catch (error) {
    res.status(400).json({ error: 'Token is Blacklisted!!' });
  }
};

module.exports = {
  checkBlacklistedToken,
};
