const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
// const smtpConfig = nodemailer.createTransport({
//   host: "SMTP SERVER",
//   port: 25,
//   secure: false,
//   requireTLS: false,
//   auth: {
//     user: "user@example.com",
//     pass: "password",
//   },
// });
const smtpGmail = nodemailer.createTransport({
  service: "gmail",
  port: 46,
  secure: true,
  auth: {
    user: "testmailsend102@gmail.com",
    pass: "mailsendtest102",
  },
});

router.get("/new", function (req, res, next) {
  res.render("password_resets", {
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post(
  "/",
  function (req, res, next) {
    const email = req.body.email;

    knex("users")
      .where({ email: email })
      .then(function (resp) {
        if (resp.length !== 1) {
          res.render("password_resets", {
            title: "Forgot Password",
            errorMessage: ["Email address not found"],
            isAuth: req.isAuthenticated(),
          });
        } else {
          // send email
          next();
        }
      })
      .catch(function (err) {
        console.error(err);
        res.render("password_resets", {
          title: "Forgot Password",
          errorMessage: ["DB Error"],
          isAuth: req.isAuthenticated(),
        });
      });
  },
  function (req, res) {
    const email = req.body.email;
    const token = crypto.randomBytes(16).toString("hex");
    const url =
      "localhost:3000/password_resets/" +
      token +
      "/edit?email=" +
      encodeURIComponent(email);

    const mailOptions = {
      from: "sendmailtest102@gmail.com",
      to: email,
      subject: "Password reset",
      html:
        `
    <html>
    <head>
      <meta http-equiv="Content-Type" Content="text/html;charset=UTF-8">
    </head>
    <body>
      <h1>Password reset</h1>
      <p>To reset your password click the link below:</p>
      <p>This link will expire in two hours.</p>
    ` +
        "<a href = '" +
        url +
        "'>" +
        url +
        "</a>" +
        `
      <p>
      If you did not request your password to be reset, please ignore this email and
      your password will stay as it is.
      </p>
    <body>
    </html>
    `,
    };

    knex("users")
      .where({ email: email })
      .update({
        reset_token: bcrypt.hashSync(token, 10),
        reset_limit: knex.fn.now(),
      })
      .then(function (result) {
        smtpGmail.sendMail(mailOptions, function (err) {
          if (err) {
            console.error(err);
            res.render("password_resets", {
              title: "Forgot Password",
              errorMessage: ["sendMail Error"],
              isAuth: req.isAuthenticated(),
            });
          } else {
            res.render("index", {
              title: "MicroPost",
              message: "Email sent with password reset instructions",
              isAuth: req.isAuthenticated(),
            });
          }
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("password_resets_edit", {
          title: "Forgot Password",
          errorMessage: ["DB error"],
          isAuth: req.isAuthenticated(),
          email: email,
        });
      });
  }
);

router.get("/:token/edit", function (req, res) {
  const email = decodeURI(req.query.email);
  // emailも追加
  res.render("password_resets_edit", {
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
    email: email,
  });
});

router.post(
  "/:token/edit",
  function (req, res, next) {
    const token = req.params.token;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.confirmation;

    if (password !== passwordConfirm) {
      res.render("password_resets_edit", {
        title: "Forgot Password",
        errorMessage: ["Password doesn't match"],
        isAuth: req.isAuthenticated(),
        email: email,
      });
    } else {
      knex("users")
        .where({ email: email })
        .then(function (result) {
          result = JSON.parse(JSON.stringify(result))[0];
          if (result !== undefined) {
            if (
              Date.parse(result.reset_limit) >=
              Date.now() - 2 * 60 * 60 * 1000
            ) {
              if (bcrypt.compareSync(token, result.reset_token)) {
                // password登録
                next();
              } else {
                res.render("password_resets_edit", {
                  title: "Forgot Password",
                  errorMessage: ["Token error Please issue the token again."],
                  isAuth: req.isAuthenticated(),
                  email: email,
                });
              }
            } else {
              res.render("password_resets_edit", {
                title: "Forgot Password",
                errorMessage: [
                  "The tokens have expired Please issue the token again",
                ],
                isAuth: req.isAuthenticated(),
                email: email,
              });
            }
          } else {
            res.render("password_resets_edit", {
              title: "Forgot Password",
              errorMessage: ["DB error Please issue the token again"],
              isAuth: req.isAuthenticated(),
              email: email,
            });
          }
        })
        .catch(function (err) {
          console.error(err);
          res.render("password_resets_edit", {
            title: "Forgot Password",
            errorMessage: ["DB error Please issue the token again"],
            isAuth: req.isAuthenticated(),
            email: email,
          });
        });
    }
  },
  function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    knex("users")
      .where({ email: email })
      .update({ password: bcrypt.hashSync(password, 10) })
      .then(function (result) {
        res.render("index", {
          title: "MicroPost",
          message: "Your password has been reset",
          isAuth: req.isAuthenticated(),
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("password_resets_edit", {
          title: "Forgot Password",
          errorMessage: ["DB error Please issue the token again"],
          isAuth: req.isAuthenticated(),
          email: email,
        });
      });
  }
);

module.exports = router;
