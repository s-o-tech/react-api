const { validationResult } = require("express-validator");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${param}: ${msg}`;
};

module.exports = {
  validationResult: (request) =>
    validationResult(request).formatWith(errorFormatter),
};
