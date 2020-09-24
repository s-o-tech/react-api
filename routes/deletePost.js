const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/',function(req,res,next){
  res.render('home',{title:'Home',errorMessage:[],isAuth:false/*req.isAuthenticated()*/});
});

router.post('/', function(req,res,next){
  const postId = req.body.postId;
  const userId = req.user.id;

  knex('microposts')
    .where({
    id: postId,
    user_id: userId,
  })
    .del()
    .then(function(resp){
      res.redirect('home');
    })
    .catch(function(err){
      console.error(err);
      res.render('home',{title:'Home',errorMessage:[`Posting failed`],isAuth:false});
    })
}

);
module.exports = router;
