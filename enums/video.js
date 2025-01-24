const videoPermissions = {
  UPLOAD: 'UPLOAD',
  TRIM: 'TRIM',
  SHARE: 'SHARE',
  MERGE: 'MERGE',
};

const planCredits = {
  UPLOAD: 10,
  TRIM: 5,
  MERGE: 10,
  SHARE: 2,
};

const planEnum = {
  FREE: 'FREE',
  PRO: 'PRO',
  ULTRA: 'ULTRA',
};

const planPriorityMapping = {
  FREE: 0,
  PRO: 1,
  ULTRA: 2,
};

const planPurchaseErrorCodes = {
  SAME_PLAN_ERROR: 'same-plan-error',
  TIER_PLAN_ERROR: 'tier-plan-error',
  PLAN_PURCHASE_GOAHEAD: 'plan-purchase-goahead',
};

const planDetails = {
  FREE: {
    type: planEnum.FREE,
    permissions: [videoPermissions.UPLOAD, videoPermissions.SHARE],
    credits: 50,
  },
  PRO: {
    type: planEnum.PRO,
    permissions: [videoPermissions.UPLOAD, videoPermissions.SHARE, videoPermissions.TRIM],
    credits: 500,
  },
  ULTRA: {
    type: planEnum.ULTRA,
    permissions: [
      videoPermissions.UPLOAD,
      videoPermissions.SHARE,
      videoPermissions.TRIM,
      videoPermissions.MERGE,
    ],
    credits: 1500,
  },
};

module.exports = {
  videoPermissions: Object.freeze(videoPermissions),
  planCredits: Object.freeze(planCredits),
  planDetails: Object.freeze(planDetails),
  planEnum: Object.freeze(planEnum),
  planPriorityMapping: Object.freeze(planPriorityMapping),
  planPurchaseErrorCodes: Object.freeze(planPurchaseErrorCodes),
};
