const express = require("express");
const router = express.Router();

const User = require("../../models/user");

router.get("/", async function (req, res, next) {
  const userId = req.user.id;
  const baseUrl = req.baseUrl;
  let targetUserId = userId;

  if (baseUrl.startsWith("/users")) {
    targetUserId = Number(baseUrl.replace(/[^0-9]/g, ""));
  }

  const user = await User.find(targetUserId);
  User.followers(targetUserId)
    .then(function (result) {
      const followers = JSON.parse(JSON.stringify(result));
      res.render("pages/followers", {
        current_user: req.user,
        user,
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        followers: followers,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render("pages/index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
      });
    });
});

module.exports = router;
