const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const User = require("../models/user");
const SignupParamValidator = require("../midleware/validators/signupParamValidator");

router.get("/", function (req, res, next) {
  res.render("signup", {
    title: "Sign Up",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post("/", SignupParamValidator, function (req, res, next) {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${param}: ${msg}`;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    res.render("signup", {
      title: "Sign up",
      errorMessage: result.array(),
      isAuth: req.isAuthenticated(),
    });
    return;
  }

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.createUser(username, email, password)
    .then(function (resp) {
      // あとで変更予定
      res.redirect("/");
    })
    .catch(function (err) {
      console.error(err);
      res.render("signup", {
        title: "Sign up",
        errorMessage: [`This username(${username}) is already used`],
        isAuth: req.isAuthenticated(),
      });
    });
});

module.exports = router;
