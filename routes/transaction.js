const express = require("express");

const router = express.Router();

const TransactionController = require("../controllers/transaction");
const transaction = new TransactionController();

const {
  basicTransactionTokenGenerationValidator,
} = require("../validators/transaction");

const { authenticateToken, authoriseRole } = require("../middlewares/auth");
const { checkBlacklistedToken } = require("../middlewares/token");
const { USER } = require("../enums/user");

/**
 * @route   POST /transaction/generate
 * @desc    Get roles for user
 * @access  Private (anyone with user role can do it)
 * @body  { userId: <ObjectId>, credits: <number> }
 */
router.post(
  "/generate",
  [
    authenticateToken,
    authoriseRole(USER),
    basicTransactionTokenGenerationValidator,
  ],
  transaction.generateToken
);

/**
 * @route   POST /transaction/commit
 * @desc    Get roles for user
 * @access  Private (anyone with user role can do it)
 * @body  { token: <JWT Token> }
 */
router.post(
  "/commit",
  [authenticateToken, authoriseRole(USER), checkBlacklistedToken],
  transaction.commitTransaction
);

module.exports = router;
