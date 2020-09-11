const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  res.render("signup", {
    title: "Sign Up",
    errorMessage: [],
    isAuth: false /* req.isAuthenticated() */,
  });
});

router.post("/", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const email = req.body.email;
  const errorMessage = [];

  if (username === "") {
    errorMessage.push("username can't be blank");
  }

  if (password === "") {
    errorMessage.push("password can't be blank");
  }

  if (
    email === "" ||
    !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    errorMessage.push("email is invalid");
  }

  if (password !== passwordConfirm) {
    errorMessage.push("Password doesn't match.");
  }

  if (errorMessage.length !== 0) {
    res.render("signup", {
      title: "Sign up",
      errorMessage: errorMessage,
      isAuth: false,
    });
  } else {
    knex("user")
      .insert({ name: username, password: password, email: email })
      .then(function (resp) {
        // あとで変更予定
        res.redirect("/");
      })
      .catch(function (err) {
        console.error(err);
        res.render("signup", {
          title: "Sign up",
          errorMessage: [`This username(${username}) is already used`],
          isAuth: false,
        });
      });
  }
});

module.exports = router;
