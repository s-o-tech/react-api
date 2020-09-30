const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  const userId = req.user.id;
  const baseUrl = req.baseUrl;
  let targetUserId = userId;
  let userName = req.user.name;
  let followed = false;
  let total = "";
  let totalFollowing = "";
  let totalFollowers = "";

  console.log(baseUrl);

  if (baseUrl.startsWith("/users")) {
    targetUserId = Number(baseUrl.replace(/[^0-9]/g, ""));
  }

  console.log(targetUserId);

  if (userId !== targetUserId) {
    knex("relationships")
      .where({ follower_id: req.user.id, followed_id: targetUserId })
      .then(function (result) {
        if (Number(result.length) !== 0) {
          followed = true;
        }
      });
  }

  let currentPage;
  if (req.query.page === undefined) {
    currentPage = 1;
  } else {
    currentPage = parseInt(req.query.page);
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
        userId: userId,
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
        userId: userId,
      });
    });

  knex("microposts")
    .where("user_id", targetUserId)
    .then(function (result) {
      total = result.length;
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

  knex("microposts")
    .where("user_id", targetUserId)
    .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
    .then(function (result) {
      const microposts = JSON.parse(JSON.stringify(result.data));
      const pagination = result.pagination;
      res.render("profile", {
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        userId: userId,
        targetUserId: targetUserId,
        userName: userName,
        followed: followed,
        microposts: microposts,
        total: total,
        totalFollowing: totalFollowing,
        totalFollowers: totalFollowers,
        pagination: pagination,
      });
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
});

router.post("/", function (req, res, next) {
  const followerId = req.user.id;

  if (Object.keys(req.body)[0] === "follow") {
    const followedId = Number(req.body.follow);
    knex("relationships")
      .insert({ follower_id: followerId, followed_id: followedId })
      .then(function (resp) {
        res.redirect(`/users/${followedId}`);
      })
      .catch(function (err) {
        console.error(err);
        res.render("index", {
          title: "",
          errorMessage: [err.sqlMessage],
          isAuth: false,
        });
      });
  } else if (Object.keys(req.body)[0] === "unFollow") {
    const followedId = Number(req.body.unFollow);
    knex("relationships")
      .where({
        follower_id: followerId,
        followed_id: followedId,
      })
      .del()
      .then(function (resp) {
        res.redirect(`/users/${followedId}`);
      })
      .catch(function (err) {
        console.error(err);
        res.render("index", {
          title: "",
          errorMessage: [err.sqlMessage],
          isAuth: false,
        });
      });
  }
});

module.exports = router;
