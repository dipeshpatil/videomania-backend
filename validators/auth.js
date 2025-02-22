const { check } = require('express-validator');

module.exports = {
  // Checks if name, email and password fields are defined and returns Boolean Array
  basicUserRegistrationValidator: [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],

  // Checks if email and password fields are defined and returns Boolean Array
  basicEmailAndPasswordRequiredValidator: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
};
