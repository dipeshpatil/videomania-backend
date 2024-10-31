const { check } = require("express-validator");

module.exports = {
  // Checks if email and password fields are defined and returns Boolean Array
  basicPermissionsRequiredValidator: [
    body("permissions")
      .isArray()
      .withMessage("permissions must be a non-empty array"),
  ],
};
