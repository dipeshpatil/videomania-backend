const { body, param } = require("express-validator");

module.exports = {
  basicVideoTrimValidator: [
    body("start", "Start Time is required").not().isEmpty(),
    body("end", "End Time is required").not().isEmpty(),
  ],

  basicMergeValidator: [
    body("videoIds")
      .isArray({ min: 2 })
      .withMessage(
        "videoIds must be a non-empty array with minimum 2 videoIds"
      ),
    body("videoIds.*").isInt().withMessage("Each videoId must be an integer"),
  ],

  basicShareValidator: [
    param("videoId").isInt().withMessage("videoId must be an integer"),
  ],
};
