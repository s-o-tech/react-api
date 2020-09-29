const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("signin", {
    title: "Sign in",
    isAuth: req.isAuthenticated(),
    errorMessage: req.flash("error"),
  });
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
