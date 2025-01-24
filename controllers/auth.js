const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { appConfig } = require('../config/secrets');
const { USER } = require('../enums/user');
const { planDetails, planEnum } = require('../enums/video');

class AuthController {
  constructor() {}

  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // Check if user already exists
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
      }

      const { permissions, credits } = planDetails[planEnum.FREE];
      user = new User({
        name,
        email,
        password,
        permissions,
        credits,
        type: planEnum.FREE,
        role: USER,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, appConfig.jwtSecret, appConfig.jwtOptions, (err, token) => {
        if (err) {throw err;}
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  async authenticateUserAndGetToken(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
      }

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, appConfig.jwtSecret, appConfig.jwtOptions, (err, token) => {
        if (err) {throw err;}
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = AuthController;
