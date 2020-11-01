const express = require("express");
const router = express.Router();

const Micropost = require("../models/micropost");
const wrap = require("../helpers/async_wrapper");

router.post(
  "/",
  wrap(async function (req, res, next) {
    const userId = req.user.id;
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
  })
);

// NOTE: FormではDELETEは利用できない(GET,POSTのみ可)
router.post(
  "/delete",
  wrap(async function (request, response) {
    const userId = request.user.id;
    const postId = request.body.post_id;

    await Micropost.del(userId, postId);
    response.redirect("/");
  })
);

module.exports = router;
