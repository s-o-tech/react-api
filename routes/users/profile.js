const express = require("express");
const router = express.Router();
const knex = require("../../db/knex");
const User = require("../../models/user");
const Micropost = require("../../models/micropost");
const Relationship = require("../../models/relationship");

router.get("/", async function (req, res, next) {
  const userId = req.user.id;
  const baseUrl = req.baseUrl;
  let targetUserId = userId;
  let relationship = null;

  console.log(baseUrl);

  if (baseUrl.startsWith("/users")) {
    targetUserId = Number(baseUrl.replace(/[^0-9]/g, ""));
  }

  console.log(targetUserId);

  if (userId !== targetUserId) {
    Relationship.find(req.user.id, targetUserId).then(function (result) {
      relationship = result;
    });
  }

  let currentPage;
  if (req.query.page === undefined) {
    currentPage = 1;
  } else {
    currentPage = parseInt(req.query.page);
  }

  const user = await User.find(targetUserId);
  const microposts = await Micropost.findAll(targetUserId, currentPage);

  res.render("pages/profile", {
    current_user: req.user,
    user,
    title: "",
    message: "",
    isAuth: req.isAuthenticated(),
    relationship: relationship,
    microposts: microposts,
    pagination: { currentPage: 0, lastPage: 0 },
  });
});

module.exports = router;
