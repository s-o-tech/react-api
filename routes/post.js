const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/',function(req,res,next){
    res.render('home',{title:'Home',errorMessage:[],isAuth:false/*req.isAuthenticated()*/});
});

router.post('/', function(req,res,next){
    const userId = req.user.id;;
    const content = req.body.content;

    knex('microposts').insert({content:content,user_id:userId})
      .then(function(resp){
          res.redirect('home');
      })
      .catch(function(err){
          console.error(err);
          res.render('home',{title:'Home',errorMessage:[content],isAuth:false});
      })
}

);
module.exports = router;
