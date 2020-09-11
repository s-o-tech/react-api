const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    req.logout();
    res.redirect('/');
  }
  else{
    res.redirect('signin');
  }
});

module.exports = router;