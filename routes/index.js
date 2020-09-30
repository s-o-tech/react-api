const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const userName = req.user.name;
    let total = "";
    let currentPage;

    if (req.query.page === undefined) {
      currentPage = 1;
    } else {
      currentPage = parseInt(req.query.page);
    }

    knex("microposts")
      .where("user_id", userId)
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
      .where("user_id", userId)
      .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
      .then(function (result) {
        const microposts = JSON.parse(JSON.stringify(result.data));
        const pagination = result.pagination;
        console.debug(microposts);
        res.render("index", {
          title: "",
          message: "",
          isAuth: req.isAuthenticated(),
          userId: userId,
          userName: userName,
          microposts: microposts,
          total: total,
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
  } else {
    res.render("index", {
      title: "MicroPost",
      message: "",
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

router.use("/users", require("./users"));
router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));
router.use("/edit", require("./edit"));
router.use("/userlist", require("./userlist"));
router.use("/profile", require("./profile"));
router.use("/users/*", require("./profile"));

module.exports = router;
