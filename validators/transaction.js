const { body } = require("express-validator");

module.exports = {
  basicTransactionTokenGenerationValidator: [
    body("userId").not().isEmpty().withMessage("userId must not be empty"),
    body("credits")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("credits must not be empty"),
  ],
};
