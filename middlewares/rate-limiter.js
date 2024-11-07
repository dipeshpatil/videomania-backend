const RateLimiter = require("../utils/rate-limiter");

const rateLimiters = {
  video: new RateLimiter(3, 1, 10),
  auth: new RateLimiter(5, 1, 5),
  user: new RateLimiter(3, 1, 5),
  transaction: new RateLimiter(3, 1, 5),
  plan: new RateLimiter(3, 1, 10),
};

const applyRateLimiter = (rateLimiter) => (req, res, next) => {
  if (rateLimiter.tryConsumeToken()) {
    next();
  } else {
    return res.status(429).send("Too many requests");
  }
};

module.exports = { applyRateLimiter, rateLimiters };
