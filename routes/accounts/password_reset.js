const express = require("express");
const router = express.Router();
const Mail = require("../../helpers/send_mail");
const User = require("../../models/user");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/password_reset", {
    title: "Forgot Password",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
  });
});

router.post("/", async function (req, res, next) {
  const email = req.body.email;

  const ieExist = await User.exist({ email });
  if (!ieExist) {
    res.render("pages/accounts/password_reset", {
      title: "Forgot Password",
      errorMessage: ["Invalid email address"],
      isAuth: req.isAuthenticated(),
    });

    return;
  }

  try {
    const token = await User.generateResetToken(email);
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
      title: "MicroPost",
      message: "Email sent with password reset instructions",
      isAuth: req.isAuthenticated(),
    });
  } catch (err) {
    res.render("pages/accounts/password_reset", {
      title: "Forgot Password",
      errorMessage: [err],
      isAuth: req.isAuthenticated(),
    });
  }
});

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
