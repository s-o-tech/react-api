const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const User = require("../models/user");

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    let currentPage;

    if (req.query.page === undefined) {
      currentPage = 1;
    } else {
      currentPage = parseInt(req.query.page);
    }

    const user = await User.find(userId);

    knex("microposts")
      .where("user_id", userId)
      .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
      .then(function (result) {
        const microposts = JSON.parse(JSON.stringify(result.data));
        const pagination = result.pagination;
        res.render("pages/index", {
          current_user: req.user,
          user,
          title: "",
          isAuth: req.isAuthenticated(),
          microposts: microposts,
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
  } else {
    res.render("pages/index", {
      title: "",
      isAuth: req.isAuthenticated(),
    });
  }
});

router.post("/", function (req, res, next) {
  const userId = req.user.id;
  if (Object.keys(req.body)[0] === "content") {
    const content = req.body.content;
    knex("microposts")
      .insert({ content: content, user_id: userId })
      .then(function (resp) {
        res.redirect("/");
      })
      .catch(function (err) {
        console.error(err);
        res.render("/", {
          title: "",
          errorMessage: [content],
          isAuth: false,
        });
      });
  } else if (Object.keys(req.body)[0] === "postId") {
    const postId = req.body.postId;

    knex("microposts")
      .where({
        id: postId,
        user_id: userId,
      })
      .del()
      .then(function (resp) {
        res.redirect("/");
      })
      .catch(function (err) {
        console.error(err);
        res.render("/", {
          title: "",
          errorMessage: [`Posting failed`],
          isAuth: false,
        });
      });
  }
});

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));
router.use("/password_resets", require("./password_resets"));
router.use("/edit", require("./edit"));
router.use("/users", require("./users"));
router.use("/relationship", require("./relationship"));

module.exports = router;
