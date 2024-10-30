const { body, param } = require("express-validator");

module.exports = {
  basicVideoTrimValidator: [
    param("videoId").not().isEmpty().withMessage("videoId must not be empty"),
    body("start", "Start Time is required").not().isEmpty(),
    body("end", "End Time is required").not().isEmpty(),
  ],

  basicMergeValidator: [
    body("videoIds")
      .isArray({ min: 2 })
      .withMessage(
        "videoIds must be a non-empty array with minimum 2 videoIds"
      ),
  ],

  basicShareValidator: [
    param("videoId").not().isEmpty().withMessage("videoId must be valid"),
  ],
};
