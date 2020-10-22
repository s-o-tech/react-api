const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const User = require("../../models/user");
const EditParamValidator = require("../../midleware/validators/editParamValidator");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/edit", {
    current_user: req.user,
    title: "Edit User",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
    userId: req.user.id,
  });
});

router.post("/", EditParamValidator, function (req, res, next) {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${param}: ${msg}`;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    res.render("pages/accounts/edit", {
      title: "Edit User",
      errorMessage: result.array(),
      isAuth: req.isAuthenticated(),
    });
    return;
  }

  const userId = req.user.id;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  User.update(userId, {
    name: username,
    password: password,
    email: email,
  })
    .then(function () {
      res.render("pages/index", {
        title: "MicroPost",
        userId: userId,
        message: `Welcome ${username}! Please check your email to activate your account.`,
        isAuth: req.isAuthenticated(),
      });
    })
    .catch(function (err) {
      console.error(err);
      // usernameが重複している場合
      if (/users.users_name_unique/.test(err.sqlMessage)) {
        res.render("pages/accounts/edit", {
          title: "Edit User",
          errorMessage: [`This username(${username}) is already used`],
          isAuth: req.isAuthenticated(),
        });
      }
      // emailが重複している場合
      else if (/users.users_email_unique/.test(err.sqlMessage)) {
        res.render("pages/accounts/dit", {
          title: "Edit User",
          errorMessage: [`This email(${email}) is already used`],
          isAuth: req.isAuthenticated(),
        });
      }
      // その他のエラーはSQLから出力された文をそのまま表示させます
      // ここの仕様は応相談
      else {
        res.render("pages/accounts/edit", {
          title: "Edit User",
          errorMessage: [err.sqlMessage],
          isAuth: req.isAuthenticated(),
        });
      }
    });
});

module.exports = router;
