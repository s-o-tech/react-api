const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  console.debug("following");
  const userId = req.user.id;
  const userName = req.user.name;
  let totalFollowing = "";
  let totalFollowers = "";

  knex("relationships")
    .where("follower_id", userId)
    .then(function (result) {
      totalFollowing = result.length;
    })
    .catch(function (err) {
      console.error(err);
      res.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
        userId: userId,
      });
    });

  knex("relationships")
    .where("followed_id", userId)
    .then(function (result) {
      totalFollowers = result.length;
    })
    .catch(function (err) {
      console.error(err);
      res.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
        userId: userId,
      });
    });

  knex("relationships")
    .join("users", "relationships.followed_id", "=", "users.id")
    .where("follower_id", userId)
    .then(function (result) {
      const following = JSON.parse(JSON.stringify(result));
      console.debug("result");
      console.debug(following);
      res.render("following", {
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        userName: userName,
        userId: userId,
        totalFollowing: totalFollowing,
        totalFollowers: totalFollowers,
        following: following,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render("following", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
      });
    });
});

module.exports = router;
