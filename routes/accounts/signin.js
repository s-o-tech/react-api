const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/signin", {
    title: "Sign in",
    isAuth: req.isAuthenticated(),
    errorMessage: req.flash("error"),
  });
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/accounts/signin",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.body.remember_me) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
    res.redirect("/");
  }
);

module.exports = router;
