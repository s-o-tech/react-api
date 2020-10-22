const express = require("express");
const router = express.Router();

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));
router.use("/activation", require("./activation"));
router.use("/password_reset", require("./password_reset"));
router.use("/edit", require("./edit"));

module.exports = router;
