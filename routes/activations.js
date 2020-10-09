const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");

router.get(
  "/:token/edit",
  function (req, res, next) {
    const email = decodeURI(req.query.email);
    const token = req.params.token;

    knex("users")
      .where({ email: email })
      .then(function (result) {
        result = JSON.parse(JSON.stringify(result))[0];
        if (result !== undefined) {
          if (bcrypt.compareSync(token, result.activation_token)) {
            next();
          } else {
            res.render("pages/activations", {
              title: "Account activation",
              errorMessage: ["Token error. Please issue the token again."],
              isAuth: req.isAuthenticated(),
            });
          }
        }
      });
  },
  function (req, res) {
    const email = decodeURI(req.query.email);
    knex("users")
      .where({ email: email })
      .update({
        activation_token: null,
        isActivated: true,
        activated_at: knex.fn.now(),
      })
      .then(function (result) {
        res.render("pages/index", {
          title: "MicroPost",
          message: "Account activated",
          isAuth: req.isAuthenticated(),
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render("pages/activations", {
          title: "Account activation",
          errorMessage: ["DB Error"],
          isAuth: req.isAuthenticated(),
        });
      });
  }
);

module.exports = router;
