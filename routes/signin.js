let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/',function(req,res,next){
    res.render('signin',{title:"Sign in",isAuth:req.isAuthenticated(),errorMessage:req.flash('error')});
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  }
));

module.exports = router;