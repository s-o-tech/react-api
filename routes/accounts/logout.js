const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  console.log(req.cookies);
  if (req.isAuthenticated()) {
    req.logout();
    res.json({
      result:true
    })
  } else {
    console.log("Not Logged In")
    res.json({
      result:false
    })
  }
});

module.exports = router;
