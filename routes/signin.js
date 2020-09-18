const express = require("express");
const router = express.Router();
const passport = require("passport");
const crypto = require("crypto");
const RememberMeStrategy = require("passport-remember-me").Strategy;


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
  function (req, res, next) {
    if(!req.body.remember_me){
      console.log("no cookie");
      return next();
    }
    const token = crypto.randomBytes(64).toString("hex");

    // // ここは後にアカウント認証済みか否かで分岐させる処理に変えます
    // if (req.user.isAdmin) {
    //   res.render("index", {
    //     title: "MicroPost",
    //     message: "Welcome Admin!",
    //     isAuth: req.isAuthenticated(),
    //   });
    // } else {
    //   res.render("index", {
    //     title: "MicroPost",
    //     message: "Welcome Nomal User",
    //     isAuth: req.isAuthenticated(),
    //   });
    // }
  },
  function(req,res){
    res.redirect("/");
  }
);

module.exports = router;
