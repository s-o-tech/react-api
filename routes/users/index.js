const express = require("express");
const router = express.Router();
const knex = require("../../db/knex");

router.get("/", function (req, res, next) {
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

      // res.render("pages/userlist", {
      res.json({
        current_user: req.user,
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
      res.redirect("/users");
    });
  
});

router.post(
  "/",
  function (req, res, next) {
    // admin以外のリクエストは分岐させる
    if (req.isAuthenticated() && req.user.isAdmin) {
      const target = req.body.target;
      knex("users")
        .where({ id: target })
        .del()
        .then(function (result) {
          knex("relationships")
            .where({ follower_id: target })
            .orWhere({ followed_id: target })
            .del()
            .then(function (result) {
              next();
            })
            .catch(function (err) {
              console.error(err);
              next();
            });
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
    res.redirect("/users");
  }
);

router.get("/:userid", require("./profile"));
router.get("/:userid/following", require("./following"));
router.get("/:userid/followers", require("./followers"));

module.exports = router;
