const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/auth');
const auth = new AuthController();

const {
  basicUserRegistrationValidator,
  basicEmailAndPasswordRequiredValidator,
} = require('../validators/auth');

/**
 * @route   POST /auth/register
 * @desc    Register a new user for the service
 * @access  Public (anyone can create a new user)
 * @body    { name: <string>, email: <string>, password: <string> }  // Example: { "name": "Bob", "email": "bob@x.com", "password": "123456" }
 */
router.post('/register', basicUserRegistrationValidator, auth.registerUser.bind(auth));

/**
 * @route   POST /auth/register
 * @desc    Login an existing user for the service
 * @access  Public (anyone can login with valid credentials)
 * @body    { email: <string>, password: <string> }  // Example: { "email": "bob@x.com", "password": "123456" }
 */
router.post(
  '/login',
  basicEmailAndPasswordRequiredValidator,
  auth.authenticateUserAndGetToken.bind(auth)
);

module.exports = router;
