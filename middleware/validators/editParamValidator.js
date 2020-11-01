const { check } = require("express-validator");

module.exports = [
  check("username").optional({ nullable: true }),
  check("email").optional({ nullable: true }).isEmail(),
  require("./checkPasswordConfirmation"),
];
