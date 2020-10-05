const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");

router.get("/", function (req, res, next) {
  res.render("pages/edit", {
    title: "Edit User",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
    userId: req.user.id,
  });
});

router.post("/", function (req, res, next) {
  const userID = req.user.id;
  const newUserName = req.body.username;
  let newPassword = req.body.password;
  const passwordConfirm = req.body.confirmation;
  const newEmail = req.body.email;
  const errorMessage = [];
  if (newUserName === "") {
    errorMessage.push("Username can't be blank");
  }
  if (newPassword === "") {
    errorMessage.push("Password can't be blank");
  }
  if (
    newEmail === "" ||
    !/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      newEmail
    )
  ) {
    errorMessage.push("Invalid Email");
  }
  if (newPassword !== passwordConfirm) {
    errorMessage.push("Password doesn't match.");
  }

  if (errorMessage.length !== 0) {
    res.render("pages/edit", {
      title: "Edit User",
      errorMessage: errorMessage,
      isAuth: req.isAuthenticated(),
    });
  } else {
    newPassword = bcrypt.hashSync(newPassword, 10);

    knex("users")
      .where({ id: userID })
      .update({ name: newUserName, password: newPassword, email: newEmail })
      .then(function () {
        res.render("pages/index", {
          title: "MicroPost",
          message: `Welcome ${newUserName}! Please check your email to activate your account.`,
          isAuth: req.isAuthenticated(),
        });
      })
      .catch(function (err) {
        console.error(err);
        // usernameが重複している場合
        if (/users.users_name_unique/.test(err.sqlMessage)) {
          res.render("pages/edit", {
            title: "Edit User",
            errorMessage: [`This username(${newUserName}) is already used`],
            isAuth: req.isAuthenticated(),
          });
        }
        // emailが重複している場合
        else if (/users.users_email_unique/.test(err.sqlMessage)) {
          res.render("pages/edit", {
            title: "Edit User",
            errorMessage: [`This email(${newEmail}) is already used`],
            isAuth: req.isAuthenticated(),
          });
        }
        // その他のエラーはSQLから出力された文をそのまま表示させます
        // ここの仕様は応相談
        else {
          res.render("pages/edit", {
            title: "Edit User",
            errorMessage: [err.sqlMessage],
            isAuth: req.isAuthenticated(),
          });
        }
      });
  }
});
module.exports = router;
