const { body } = require("express-validator");

module.exports = {
  basicPermissionsRequiredValidator: [
    body("permission")
      .not()
      .isEmpty()
      .withMessage("permissions must not be empty"),
  ],

  basicRoleRequiredValidator: [
    body("role").not().isEmpty().withMessage("role must not be empty"),
  ],
};
