const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", isAuth: false });
});

router.use("/users", require("./users"));
router.use("/signup", require("./signup"));

module.exports = router;
