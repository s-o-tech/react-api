const { check } = require("express-validator");

module.exports = check("confirmation").custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Password confirmation does not match password");
  }
  return true;
});
