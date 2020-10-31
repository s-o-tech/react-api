const express = require("express");
const router = express.Router();

const Mail = require("../../helpers/send_mail");
const wrap = require("../../helpers/async_wrapper");

const User = require("../../models/user");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/password_reset", {
    current_user: req.user,
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post(
  "/",
  wrap(async function (req, res, next) {
    const email = req.body.email;

    let token;
    try {
      token = await User.generateResetToken(email);
    } catch (error) {
      res.render("pages/accounts/password_reset", {
        current_user: req.user,
        title: "Forgot Password",
        errorMessage: ["Invalid email address"],
        isAuth: req.isAuthenticated(),
      });
      return;
    }

    const url = `localhost:3000/accounts/password_reset/${token}/edit?email=${encodeURIComponent(
      email
    )}`;

    const html = await Mail.buildHtml("password_reset", { url });
    const mailParam = {
      to: email,
      subject: "Password reset",
      html,
    };
    await Mail.send(mailParam);

    res.render("pages/index", {
      current_user: req.user,
      title: "MicroPost",
      message: "Email sent with password reset instructions",
      isAuth: req.isAuthenticated(),
    });
  })
);

router.get("/:token/edit", function (req, res) {
  const email = decodeURI(req.query.email);
  res.render("pages/accounts/password_reset_edit", {
    current_user: req.user,
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
    email: email,
  });
});

router.post(
  "/:token/edit",
  wrap(async function (req, res, next) {
    const token = req.params.token;
    const { email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      res.render("pages/accounts/password_reset_edit", {
        current_user: req.user,
        title: "Forgot Password",
        errorMessage: ["Password doesn't match"],
        isAuth: req.isAuthenticated(),
        email: email,
      });
      return;
    }

    try {
      await User.resetPassword(email, token, password);
      res.render("pages/index", {
        current_user: req.user,
        title: "MicroPost",
        message: "Your password has been reset",
        isAuth: req.isAuthenticated(),
      });
    } catch (err) {
      console.error(err);
      res.render("pages/accounts/password_reset_edit", {
        current_user: req.user,
        title: "Forgot Password",
        errorMessage: [err],
        isAuth: req.isAuthenticated(),
        email: email,
      });
    }
  })
);

module.exports = router;
