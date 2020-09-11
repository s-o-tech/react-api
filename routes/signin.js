const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/',function(req,res,next){
    res.render('signin',{title:"Sign in",isAuth:req.isAuthenticated(),errorMessage:req.flash('error')});
});

router.post('/', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }
),function(req,res){
    //ここは後にアカウント認証済みか否かで分岐させる処理に変えます
    if(req.user.isAdmin){
        res.render('index', {title:'MicroPost',message:'Welcome Admin!',isAuth:req.isAuthenticated()});
    }
    else{
        res.render('index', {title:'MicroPost',message:'Welcome Nomal User',isAuth:req.isAuthenticated()});
    }
});

module.exports = router;