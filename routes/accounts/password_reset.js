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

    const user = await User.where({ email });
    if (!user) {
      res.render("pages/accounts/password_reset", {
        current_user: req.user,
        title: "Forgot Password",
        errorMessage: ["Invalid email address"],
        isAuth: req.isAuthenticated(),
      });

      return;
    }

    const token = await User.generateResetToken(user.id);
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
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.confirmation;

    if (password !== passwordConfirm) {
      res.render("pages/accounts/password_reset_edit", {
        current_user: req.user,
        title: "Forgot Password",
        errorMessage: ["Password doesn't match"],
        isAuth: req.isAuthenticated(),
        email: email,
      });
    } else {
      try {
        await User.isExpired(email, token);
        next();
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
    }
  }),
  wrap(async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    try {
      await User.updateByEmail(email, {
        password: password,
        reset_token: null,
        reset_limit: null,
      });
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
        errorMessage: ["DB error. Please issue the token again."],
        isAuth: req.isAuthenticated(),
        email: email,
      });
    }
  })
);

module.exports = router;
