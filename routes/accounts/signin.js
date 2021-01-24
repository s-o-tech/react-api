const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  // res.json({
  //   current_user: req.user,
  //   title: "Sign in",
  //   isAuth: req.isAuthenticated(),
  //   errorMessage: req.flash("error"),
  // });
  const test = req.query;
  res.json({
    isAuth: req.isAuthenticated()
  })
});

router.post(
  "/",
  (req, res) => {
    console.log(req.body)
    passport.authenticate('local',(err,user,info) => {
      console.log(res.headers)
      if(err){
        return res.json({
          success:false,
          message:err.toString()
        })
      }
      if(!user) {
        return res.json({
          success:false,
          message:"No User"
        })
      }
      if(req.body.remember_me) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
      return res.json({
        success:true
      })
    })(req,res);
  }
);

module.exports = router;
