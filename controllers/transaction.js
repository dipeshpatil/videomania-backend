const { validationResult } = require('express-validator');

const { creditConfig } = require('../config/secrets');
const { generateCreditToken, decodeJWTToken } = require('../utils/transaction');
const { adjustUserCredits, logBlacklistedToken } = require('../utils/mongo');
const { addToBlacklist } = require('../utils/redis');

class TransactionController {
  constructor() {}

  async generateToken(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, credits } = req.body;
      const token = await generateCreditToken(userId, credits);
      return res.json({
        msg: `Token valid for ${creditConfig.jwtOptions.expiresIn} seconds`,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error!');
    }
  }

  async commitTransaction(req, res) {
    try {
      const { token } = req.body;
      const payload = decodeJWTToken(token);
      if (!payload) {
        return res.status(400).json({ msg: 'Transaction Failed, Token Expired Likely!' });
      }

      const {
        transaction: { userId, credits },
      } = payload;

      await adjustUserCredits(userId, credits);
      await addToBlacklist(token, creditConfig.jwtOptions.expiresIn);
      await logBlacklistedToken(userId, credits, token);

      return res.status(200).json({ msg: 'Transaction Successful!' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error!');
    }
  }
}

module.exports = TransactionController;
