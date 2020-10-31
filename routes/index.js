const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Micropost = require("../models/micropost");
const wrap = require("../helpers/async_wrapper");

/* GET home page. */
router.get(
  "/",
  wrap(async function (req, res, next) {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user.id;
        let currentPage;

        if (req.query.page === undefined) {
          currentPage = 1;
        } else {
          currentPage = parseInt(req.query.page);
        }

        const user = await User.findById(userId, currentPage);

        const microposts = await Micropost.findAll(userId, currentPage);
        // const pagination = result.pagination;
        res.render("pages/index", {
          current_user: req.user,
          user,
          title: "",
          isAuth: req.isAuthenticated(),
          microposts: microposts,
          pagination: { currentPage: 0, lastPage: 0 },
        });
      } else {
        res.render("pages/index", {
          title: "",
          isAuth: req.isAuthenticated(),
        });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  wrap(async function (req, res, next) {
    const userId = req.user.id;
    if (Object.keys(req.body)[0] === "content") {
      const content = req.body.content;
      try {
        await Micropost.insert(content, userId);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.render("pages/index", {
          title: "",
          errorMessage: [content],
          isAuth: false,
        });
      }
    } else if (Object.keys(req.body)[0] === "postId") {
      const postId = req.body.postId;
      try {
        await Micropost.del(postId, userId);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.render("pages/index", {
          title: "",
          errorMessage: [`Posting failed`],
          isAuth: false,
        });
      }
    }
  })
);

router.use("/accounts", require("./accounts"));
router.use("/users", require("./users"));
router.use("/relationship", require("./relationship"));

module.exports = router;
