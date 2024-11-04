const express = require("express");

const router = express.Router();

const PlanPurchaseController = require("../controllers/plan");
const planPurchase = new PlanPurchaseController();

const {
  basicPlanPurchaseTokenGenerationValidator,
} = require("../validators/plan");

const { authenticateToken, authoriseRole } = require("../middlewares/auth");
const { checkBlacklistedToken } = require("../middlewares/token");
const { USER } = require("../enums/user");

/**
 * @route   POST /plan/generate
 * @desc    Get roles for user
 * @access  Private (anyone with user role can do it)
 * @body  { userId: <ObjectId>, credits: <number> }
 */
router.post(
  "/generate",
  [
    authenticateToken,
    authoriseRole(USER),
    basicPlanPurchaseTokenGenerationValidator,
  ],
  planPurchase.generatePlanToken
);

/**
 * @route   POST /plan/commit
 * @desc    Get roles for user
 * @access  Private (anyone with user role can do it)
 * @body  { token: <JWT Token> }
 */
router.post(
  "/commit",
  [authenticateToken, authoriseRole(USER), checkBlacklistedToken],
  planPurchase.purchasePlan.bind(planPurchase)
);

module.exports = router;
