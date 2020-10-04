const { check } = require("express-validator");

module.exports = [
  check("username").not().isEmpty().withMessage("必須項目です。"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("必須項目です。")
    .isEmail()
    .normalizeEmail(),
  require("./checkPasswordConfirmation"),
];
