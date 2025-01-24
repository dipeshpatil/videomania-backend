const Transaction = require('../models/transaction');
const BlacklistedToken = require('../models/blacklisted-tokens');
const User = require('../models/user');

const { transactionCreditAction } = require('../enums/transaction');

const logTransaction = async (userId, credits, action, description) => {
  const transaction = new Transaction({
    userId,
    credits,
    action,
    description,
  });
  await transaction.save();
};

const logBlacklistedToken = async (userId, credits, token) => {
  const blacklistedToken = new BlacklistedToken({ token, userId, credits });
  await blacklistedToken.save();
};

const deductUserCredits = async (userId, userCredits, planCredits, transactionDesc) => {
  const remainingCredits = userCredits - planCredits;
  await User.updateOne(
    { _id: userId },
    { $set: { credits: remainingCredits < 0 ? 0 : remainingCredits } }
  );
  await logTransaction(userId, planCredits, transactionCreditAction.DEDUCT, transactionDesc);
};

const getUserExistingPlan = async (userId) => {
  const { plan } = await User.findById(userId);
  return plan;
};

const adjustUserCredits = async (userId, credits, action, description) => {
  await User.updateOne({ _id: userId }, { $inc: { credits } });
  await logTransaction(
    userId,
    credits,
    action || transactionCreditAction.TOPUP,
    description || transactionCreditAction.TOPUP
  );
};

const adjustUserPlan = async (userId, planDetails) => {
  const { permissions, credits, type } = planDetails;
  await User.updateOne({ _id: userId }, { $set: { permissions, plan: type } });
  await adjustUserCredits(userId, credits, 'planPurchase', 'Plan Purchase');
};

module.exports = {
  deductUserCredits,
  adjustUserCredits,
  adjustUserPlan,
  logBlacklistedToken,
  getUserExistingPlan,
};
