const videoPermissions = {
  UPLOAD: "upload",
  TRIM: "trim",
  SHARE: "share",
  MERGE: "merge",
};

const planCredits = {
  UPLOAD: 10,
  TRIM: 5,
  MERGE: 10,
  SHARE: 2,
};

module.exports = {
  videoPermissions: Object.freeze(videoPermissions),
  planCredits: Object.freeze(planCredits),
};
