const Transaction = require("../models/transaction");

const { transactionCreditAction } = require("../permissions/transaction");

const logTransaction = async (userId, credits, action, description) => {
  const transaction = new Transaction({
    userId,
    credits,
    action,
    description,
  });
  await transaction.save();
};

const deductUserCredits = async (
  userId,
  userCredits,
  planCredits,
  transactionDesc
) => {
  const remainingCredits = userCredits - planCredits;
  await User.updateOne(
    { _id: userId },
    { $set: { credits: remainingCredits < 0 ? 0 : remainingCredits } }
  );
  await logTransaction(
    userId,
    planCredits,
    transactionCreditAction.DEDUCT,
    transactionDesc
  );
};

const adjustUserCredits = async (userId, credits) => {
  await User.updateOne({ _id: userId }, { $inc: { credits } });
  await logTransaction(
    userId,
    credits,
    transactionCreditAction.TOPUP,
    transactionCreditAction.TOPUP
  );
};

module.exports = {
  deductUserCredits,
  adjustUserCredits,
};
