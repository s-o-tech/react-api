const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const User = require("../models/user");
const SignupParamValidator = require("../midleware/validators/signupParamValidator");

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const knex = require("../db/knex");

const smtpConfig = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  requiresAuth: true,
  auth: {
    user: "d.higashi+school@atomitech.jp",
    pass: "Dj!*m*5%asG3F^Ec",
  },
});

router.get("/", function (req, res, next) {
  res.render("pages/signup", {
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
      res.render("pages/signup", {
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
        res.render("pages/signup", {
          title: "Sign up",
          errorMessage: [
            `This username(${username}) or email(${email}) is already used`,
          ],
          isAuth: req.isAuthenticated(),
        });
      });
  },
  function (req, res) {
    const token = crypto.randomBytes(16).toString("hex");
    const username = req.body.username;
    const email = req.body.email;
    const url = `localhost:3000/account_activations/${token}/edit?email=${encodeURIComponent(
      email
    )}`;

    const mailOptions = {
      from: "d.higashi+school@atomitech.jp",
      to: email,
      subject: "Account activations",
      html: `
      <html>
      <head>
        <meta http-equiv="Content-Type" Content="text/html;charset=UTF-8">
      </head>
      <body>
        <h1>Sample App</h1>
        <p>Hi ${username},</p>
        <p>Welcome to the Sample App! Click on the link below to activate your account:</p>
        <a href = '${url}'>${url}</a>
      <body>
      </html>
      `,
    };

    knex("users")
      .where({ email: email })
      .update({
        activation_token: bcrypt.hashSync(token, 10),
      })
      .then(function (result) {
        smtpConfig.sendMail(mailOptions, function (err) {
          if (err) {
            console.error(err);
            res.render("pages/signup", {
              title: "SignUp",
              errorMessage: ["sendMail Error"],
              isAuth: req.isAuthenticated(),
            });
          } else {
            res.render("pages/index", {
              title: "MicroPost",
              message: "Email sent with activations instructions",
              isAuth: req.isAuthenticated(),
            });
          }
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/signup", {
          title: "SignUp",
          errorMessage: ["DB error"],
          isAuth: req.isAuthenticated(),
          email: email,
        });
      });
  }
);

module.exports = router;
