const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  res.render("home", {
    title: "Home",
    errorMessage: [],
    isAuth: false /* req.isAuthenticated() */,
  });
});

router.post("/", function (req, res, next) {
  console.debug(req.baseUrl);
  const followerId = req.user.id;
  const followedId = Number(req.body.targetUserId);

  knex("relationships")
    .insert({ follower_id: followerId, followed_id: followedId })
    .then(function (resp) {
      res.redirect("home");
    })
    .catch(function (err) {
      console.error(err);
      res.render("", { title: "Home", errorMessage: [content], isAuth: false });
    });
});

module.exports = router;
