const { validationResult } = require("express-validator");

const {
  planDetails,
  planPriorityMapping,
  planPurchaseErrorCodes: {
    SAME_PLAN_ERROR,
    TIER_PLAN_ERROR,
    PLAN_PURCHASE_GOAHEAD,
  },
} = require("../enums/video");
const { creditConfig } = require("../config/secrets");
const { generatePlanToken, decodeJWTToken } = require("../utils/transaction");
const { addToBlacklist } = require("../utils/redis");
const {
  adjustUserPlan,
  logBlacklistedToken,
  getUserExistingPlan,
} = require("../utils/mongo");

class PlanPurchaseController {
  constructor() {}

  async #checkExistingPlan(userPlanDetails) {
    const { currentPlan, upgradedPlan } = userPlanDetails;
    const currentPlanPriority = planPriorityMapping[currentPlan.toUpperCase()];
    const upgradedPlanPriority =
      planPriorityMapping[upgradedPlan.toUpperCase()];

    if (currentPlanPriority === upgradedPlanPriority) {
      return SAME_PLAN_ERROR;
    } else if (currentPlanPriority > upgradedPlanPriority) {
      return TIER_PLAN_ERROR;
    } else {
      return PLAN_PURCHASE_GOAHEAD;
    }
  }

  async generatePlanToken(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, planType } = req.body;
      const token = await generatePlanToken(userId, planType.toUpperCase());
      return res.json({
        msg: `Token valid for ${creditConfig.jwtOptions.expiresIn} seconds`,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!");
    }
  }

  async purchasePlan(req, res) {
    try {
      const { token } = req.body;
      const payload = decodeJWTToken(token);
      if (!payload)
        return res
          .status(400)
          .json({ msg: "Transaction Failed, Token Expired Likely!" });

      const {
        plan: { userId, planType },
      } = payload;

      const upgradedPlan = planDetails[planType.toUpperCase()];
      const currentPlan = await getUserExistingPlan(userId);
      const planPurchaseCheck = await this.#checkExistingPlan({
        currentPlan,
        upgradedPlan: planType,
      });

      if (planPurchaseCheck === SAME_PLAN_ERROR) {
        return res.status(400).json({
          msg: "Plan purchase failed due to same plan, consider a credit top-up.",
        });
      } else if (planPurchaseCheck === TIER_PLAN_ERROR) {
        return res.status(400).json({
          msg: "Plan purchase failed since you already have a higher tier plan, contact support",
        });
      } else if (planPurchaseCheck === PLAN_PURCHASE_GOAHEAD) {
        await adjustUserPlan(userId, upgradedPlan);
        await addToBlacklist(token, creditConfig.jwtOptions.expiresIn);
        await logBlacklistedToken(userId, upgradedPlan.credits, token);
        return res.status(200).json({ msg: "Transaction Successful!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server Error!");
    }
  }
}

module.exports = PlanPurchaseController;
