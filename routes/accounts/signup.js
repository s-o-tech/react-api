const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const User = require("../../models/user");
const SignupParamValidator = require("../../midleware/validators/signupParamValidator");

const wrap = require("../../helpers/async_wrapper");
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
  wrap(async function (req, res, next) {
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

    let activationToken;
    try {
      activationToken = await User.createUser(username, email, password);
    } catch (err) {
      console.error(err);
      res.render("pages/accounts/signup", {
        title: "Sign up",
        errorMessage: [
          `This username(${username}) or email(${email}) is already used`,
        ],
        isAuth: req.isAuthenticated(),
      });
      return;
    }

    const url = `localhost:3000/accounts/activation/${activationToken}/edit?email=${encodeURIComponent(
      email
    )}`;

    const html = await Mail.buildHtml("activate_account", { username, url });
    const mailParam = {
      to: email,
      subject: "Account activation",
      html,
    };
    await Mail.send(mailParam);

    res.render("pages/index", {
      title: "MicroPost",
      message: "Email sent with activation instructions",
      isAuth: req.isAuthenticated(),
    });
  })
);

module.exports = router;
