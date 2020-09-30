const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  if (req.isAuthenticated()) {
    let currentPage;
    if (req.query.page === undefined) {
      currentPage = 1;
    } else {
      currentPage = parseInt(req.query.page);
    }
    knex("users")
      .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
      .then(function (result) {
        const userRows = JSON.parse(JSON.stringify(result.data));
        const pagination = result.pagination;

        res.render("userlist", {
          title: "Userlist",
          message: "",
          isAuth: req.isAuthenticated(),
          users: userRows,
          pagination: pagination,
          isAdmin: req.user.isAdmin,
          userId: req.user.id,
        });
      })
      .catch(function (err) {
        // error処理は変更予定
        console.error(err);
        res.redirect("/userlist");
      });
  } else {
    res.redirect("/signin");
  }
});

router.post(
  "/",
  function (req, res, next) {
    // admin以外のリクエストは分岐させる
    if (req.isAuthenticated() && req.user.isAdmin) {
      const target = req.body.target;
      knex("users")
        .where({ name: target })
        .del()
        .then(function (result) {
          next();
        })
        .catch(function (err) {
          console.error(err);
          next();
        });
    } else {
      next();
    }
  },
  function (req, res) {
    res.redirect("/userlist");
  }
);

module.exports = router;
