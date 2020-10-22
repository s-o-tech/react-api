const express = require("express");
const router = express.Router();
const Mail = require("../../helpers/send_mail");
const User = require("../../models/user");

router.get("/new", function (req, res, next) {
  res.render("pages/accounts/password_reset", {
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post(
  "/",
  function (req, res, next) {
    const email = req.body.email;

    User.exist(email)
      .then(() => {
        next();
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/password_reset", {
          title: "Forgot Password",
          errorMessage: [err],
          isAuth: req.isAuthenticated(),
        });
      });
  },
  function (req, res) {
    const email = req.body.email;

    User.generateResetToken(email)
      .then((token) => {
        const url = `localhost:3000/password_resets/${token}/edit?email=${encodeURIComponent(
          email
        )}`;
        const mailOptions = Mail.passwordResetConfig(url, email);

        Mail.send(mailOptions)
          .then(() => {
            res.render("pages/index", {
              title: "MicroPost",
              message: "Email sent with password reset instructions",
              isAuth: req.isAuthenticated(),
            });
          })
          .catch((err) => {
            res.render("pages/accounts/password_reset", {
              title: "Forgot Password",
              errorMessage: [err],
              isAuth: req.isAuthenticated(),
            });
          });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/password_reset_edit", {
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
  res.render("pages/accounts/password_reset_edit", {
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
      res.render("pages/accounts/password_reset_edit", {
        title: "Forgot Password",
        errorMessage: ["Password doesn't match"],
        isAuth: req.isAuthenticated(),
        email: email,
      });
    } else {
      User.isExpired(email, token)
        .then(() => {
          next();
        })
        .catch(function (err) {
          console.error(err);
          res.render("pages/accounts/password_reset_edit", {
            title: "Forgot Password",
            errorMessage: [err],
            isAuth: req.isAuthenticated(),
            email: email,
          });
        });
    }
  },
  function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.updateByEmail(email, {
      password: password,
      reset_token: null,
      reset_limit: null,
    })
      .then(() => {
        res.render("pages/index", {
          title: "MicroPost",
          message: "Your password has been reset",
          isAuth: req.isAuthenticated(),
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/password_reset_edit", {
          title: "Forgot Password",
          errorMessage: ["DB error. Please issue the token again."],
          isAuth: req.isAuthenticated(),
          email: email,
        });
      });
  }
);

module.exports = router;
