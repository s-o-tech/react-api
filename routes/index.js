const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "MicroPost",
    message: "",
    isAuth: req.isAuthenticated(),
  });
});

router.use("/users", require("./users"));
router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));
router.use("/edit", require("./edit"));
router.use("/home", require("./postList"));
router.use("/profile", require("./postList"));
router.use("/post", require("./post"));
router.use("/deletePost", require("./deletePost"));

module.exports = router;
