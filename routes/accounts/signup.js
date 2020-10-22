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

router.post("/", SignupParamValidator, async function (req, res, next) {
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

  try {
    await User.createUser(username, email, password);
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

  try {
    const token = await User.generateActivationToken(email);
    const url = `localhost:3000/accounts/activation/${token}/edit?email=${encodeURIComponent(
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
  } catch (err) {
    res.render("pages/accounts/signup", {
      title: "SignUp",
      errorMessage: [err],
      isAuth: req.isAuthenticated(),
    });
  }
});

module.exports = router;
