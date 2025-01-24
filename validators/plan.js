const { body } = require('express-validator');

module.exports = {
  basicPlanPurchaseTokenGenerationValidator: [
    body('userId').not().isEmpty().withMessage('userId must not be empty'),
    body('planType').not().isEmpty().withMessage('planType must not be empty'),
  ],
};
