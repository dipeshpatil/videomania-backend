const applyRateLimiter = (rateLimiter) => (req, res, next) => {
  if (rateLimiter.tryConsumeToken()) {
    next();
  } else {
    return res.status(429).send("Too many requests");
  }
};

module.exports = { applyRateLimiter };
