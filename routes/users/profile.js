const express = require("express");
const router = express.Router();
const knex = require("../../db/knex");
const User = require("../../models/user");
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

  knex("microposts")
    .where("user_id", targetUserId)
    .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
    .then(function (result) {
      const microposts = JSON.parse(JSON.stringify(result.data));
      const pagination = result.pagination;
      res.render("pages/profile", {
        current_user: req.user,
        user,
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        relationship: relationship,
        microposts: microposts,
        total: user.post_count,
        pagination: pagination,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render("pages/index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
        userId: userId,
      });
    });
});

module.exports = router;
