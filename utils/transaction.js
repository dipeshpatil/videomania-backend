const jwt = require("jsonwebtoken");

const { creditConfig } = require("../config/secrets");

const generateCreditToken = (userId, credits) => {
  const payload = {
    transaction: {
      userId,
      credits,
    },
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      creditConfig.jwtSecret,
      creditConfig.jwtOptions,
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const decodeCreditToken = (token) => {
  try {
    const decoded = jwt.verify(token, creditConfig.jwtSecret);
    return decoded;
  } catch (error) {
    console.log("Token Expired!");
    return null;
  }
};

module.exports = {
  generateCreditToken,
  decodeCreditToken,
};
