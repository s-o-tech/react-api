const express = require("express");
const router = express.Router();
const User = require("../../models/user");

router.get(
  "/:token/edit",
  function (req, res, next) {
    const email = decodeURI(req.query.email);
    const token = req.params.token;

    User.activationTokenVerify(email, token)
      .then(() => {
        next();
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/activation", {
          title: "Account activation",
          errorMessage: [err],
          isAuth: req.isAuthenticated(),
        });
      });
  },
  function (req, res) {
    const email = decodeURI(req.query.email);
    User.activateUser(email)
      .then(() => {
        res.render("pages/index", {
          title: "MicroPost",
          message: "Account activated",
          isAuth: req.isAuthenticated(),
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/accounts/activation", {
          title: "Account activation",
          errorMessage: ["DB Error"],
          isAuth: req.isAuthenticated(),
        });
      });
  }
);

module.exports = router;
