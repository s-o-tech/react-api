const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const nodemailer = require("nodemailer");
const smtpConfig = nodemailer.createTransport({
    host:'SMTP SERVER',
    port:25,
    secure:false,
    requireTLS:false,
    auth:{
        user:'user@example.com',
        pass:'password'
    }
});

router.get("/new", function(req, res, next){
    res.render("password_resets", {
        title: "Forgot Password",
        errorMessage: [],
        isAuth: req.isAuthenticated(),
      });
})

router.post("/new", function (req, res, next) {
    const email = req.body.email;

    knex("users")
    .where({email: email })
    .then(function (resp) {
        if(resp.length !== 1){
            res.render("password_resets", {
                title: "Forgot Password",
                errorMessage: ['Email address not found'],
                isAuth: req.isAuthenticated(),
              });
        }
    })
    .catch(function (err) {
      console.error(err);
      res.render("password_resets", {
        title: "Forgot Password",
        errorMessage: ['DB Error'],
        isAuth: req.isAuthenticated(),
      });
    });

    const mailOptions = {
        from:"user@example.com",
        to:email,
        subject:"Hello World",
        text:"Hello World"
    };

    smtpConfig.sendMail(mailOptions,function(err,info){
        if(err){
            console.error(err);
            res.render("password_resets", {
                title: "Forgot Password",
                errorMessage: ['sendMail Error'],
                isAuth: req.isAuthenticated(),
              });
        }
        else{
            res.render("index", {
                title: "MicroPost",
                errorMessage: "Email sent with password reset instructions",
                isAuth: req.isAuthenticated(),
              });
        }
    });

});

module.exports = router;
