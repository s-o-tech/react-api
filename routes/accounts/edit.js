const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const { validationResult } = require("../../midleware/validator");
const EditParamValidator = require("../../midleware/validators/editParamValidator");
const wrap = require("../../helpers/async_wrapper");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/edit", {
    current_user: req.user,
    title: "Edit User",
    errorMessage: [],
    isAuth: req.isAuthenticated(),
    userId: req.user.id,
  });
});

router.post(
  "/",
  EditParamValidator,
  wrap(async function (req, res, next) {
    const userId = req.user.id;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("pages/accounts/edit", {
        current_user: req.user,
        userId: userId,
        title: "Edit User",
        errorMessage: result.array(),
        isAuth: req.isAuthenticated(),
      });
      return;
    }

    try {
      await User.update(userId, {
        name: username,
        password: password,
        email: email,
      });
      res.redirect("/");
    } catch (err) {
      console.error(err);
      // usernameが重複している場合
      if (/users.users_name_unique/.test(err.sqlMessage)) {
        res.render("pages/accounts/edit", {
          current_user: req.user,
          userId: userId,
          title: "Edit User",
          errorMessage: [`This username(${username}) is already used`],
          isAuth: req.isAuthenticated(),
        });
      }
      // emailが重複している場合
      else if (/users.users_email_unique/.test(err.sqlMessage)) {
        res.render("pages/accounts/edit", {
          current_user: req.user,
          userId: userId,
          title: "Edit User",
          errorMessage: [`This email(${email}) is already used`],
          isAuth: req.isAuthenticated(),
        });
      }
      // その他のエラーはSQLから出力された文をそのまま表示させます
      // ここの仕様は応相談
      else {
        res.render("pages/accounts/edit", {
          current_user: req.user,
          userId: userId,
          title: "Edit User",
          errorMessage: [err.sqlMessage],
          isAuth: req.isAuthenticated(),
        });
      }
    }
  })
);

module.exports = router;
