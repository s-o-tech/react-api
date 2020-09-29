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
  const followerId = req.user.id;
  const followedId = Number(req.body.targetUserId);

  knex("relationships")
    .where({
      follower_id: followerId,
      followed_id: followedId,
    })
    .del()
    .then(function (resp) {
      res.redirect("home");
    })
    .catch(function (err) {
      console.error(err);
      res.render("home", {
        title: "Home",
        errorMessage: [`Posting failed`],
        isAuth: false,
      });
    });
});
module.exports = router;
