const authenticateToken = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (token === process.env.STATIC_TOKEN) {
    next(); // Token is valid, proceed with the request
  } else {
    res.status(403).json({ error: "Forbidden: Invalid or missing API token" });
  }
};

module.exports = {
  authenticateToken,
};
