const express = require("express");
const router = express.Router();
const knex = require("../../db/knex");

router.get("/", function (req, res, next) {
  const userId = req.user.id;
  const baseUrl = req.baseUrl;
  let userName = req.user.name;
  let targetUserId = userId;
  let totalFollowing = "";
  let totalFollowers = "";

  if (baseUrl.startsWith("/users")) {
    targetUserId = Number(baseUrl.replace(/[^0-9]/g, ""));
  }

  knex("users")
    .where("id", targetUserId)
    .then(function (result) {
      const user = JSON.parse(JSON.stringify(result));
      userName = user[0].name;
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
    .where("follower_id", targetUserId)
    .then(function (result) {
      totalFollowing = result.length;
    })
    .catch(function (err) {
      console.error(err);
      res.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
        userId: targetUserId,
      });
    });

  knex("relationships")
    .where("followed_id", targetUserId)
    .then(function (result) {
      totalFollowers = result.length;
    })
    .catch(function (err) {
      console.error(err);
      res.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
        userId: targetUserId,
      });
    });

  knex("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where("followed_id", targetUserId)
    .then(function (result) {
      const followers = JSON.parse(JSON.stringify(result));
      res.render("followers", {
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        userName: userName,
        userId: targetUserId,
        totalFollowing: totalFollowing,
        totalFollowers: totalFollowers,
        followers: followers,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
      });
    });
});

module.exports = router;
