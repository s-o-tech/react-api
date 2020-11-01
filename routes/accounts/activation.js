const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const wrap = require("../../helpers/async_wrapper");

router.get(
  "/:token/edit",
  wrap(async function (req, res, next) {
    const email = decodeURI(req.query.email);
    const token = req.params.token;

    try {
      const result = await User.activate(email, token);
      console.log(result);

      res.render("pages/index", {
        current_user: req.user,
        title: "MicroPost",
        message: "Account activated",
        isAuth: req.isAuthenticated(),
      });
    } catch (err) {
      console.error(err);
      res.render("pages/accounts/activation", {
        current_user: req.user,
        title: "Account activation",
        errorMessage: [err],
        isAuth: req.isAuthenticated(),
      });
    }
  })
);

module.exports = router;
