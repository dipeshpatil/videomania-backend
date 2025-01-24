const jwt = require('jsonwebtoken');

const { creditConfig } = require('../config/secrets');

const signJWTToken = (payload, jwtSecret, jwtOptions) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const generateCreditToken = (userId, credits) => {
  const payload = {
    transaction: {
      userId,
      credits,
    },
  };
  return signJWTToken(payload, creditConfig.jwtSecret, creditConfig.jwtOptions);
};

const generatePlanToken = (userId, planType) => {
  const payload = {
    plan: {
      userId,
      planType,
    },
  };
  return signJWTToken(payload, creditConfig.jwtSecret, creditConfig.jwtOptions);
};

const decodeJWTToken = (token) => {
  try {
    const decoded = jwt.verify(token, creditConfig.jwtSecret);
    return decoded;
  } catch (error) {
    console.log('Token Expired!');
    return null;
  }
};

module.exports = {
  generateCreditToken,
  generatePlanToken,
  decodeJWTToken,
};
