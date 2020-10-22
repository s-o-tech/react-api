const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const User = require("../../models/user");
const SignupParamValidator = require("../../midleware/validators/signupParamValidator");

const Mail = require("../../helpers/send_mail");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/signup", {
    title: "Sign Up",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post(
  "/",
  SignupParamValidator,
  function (req, res, next) {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
      // Build your resulting errors however you want! String, object, whatever - it works!
      return `${param}: ${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      res.render("pages/accounts/signup", {
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
        next();
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/signup", {
          title: "Sign up",
          errorMessage: [
            `This username(${username}) or email(${email}) is already used`,
          ],
          isAuth: req.isAuthenticated(),
        });
      });
  },
  function (req, res) {
    const username = req.body.username;
    const email = req.body.email;

    User.generateActivationToken(email)
      .then((token) => {
        const url = `localhost:3000/account_activation/${token}/edit?email=${encodeURIComponent(
          email
        )}`;
        const mailOptions = Mail.activationConfig(username, url, email);

        Mail.send(mailOptions)
          .then(() => {
            res.render("pages/index", {
              title: "MicroPost",
              message: "Email sent with activation instructions",
              isAuth: req.isAuthenticated(),
            });
          })
          .catch((err) => {
            res.render("pages/accounts/signup", {
              title: "SignUp",
              errorMessage: [err],
              isAuth: req.isAuthenticated(),
            });
          });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/signup", {
          title: "SignUp",
          errorMessage: ["DB error"],
          isAuth: req.isAuthenticated(),
          email: email,
        });
      });
  }
);

module.exports = router;
