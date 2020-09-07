const express = require('express'),
      router = express.Router(),
      knex = require('../db/knex');

router.get('/',function(req,res,next){
    
    knex('users')
        .where({id:1})
        .paginate(10,1)
        .then(function(paginator){
            console.log(paginator);
            console.log(paginator.current_page);
            console.log(paginator.data);
            res.render('userlist', {title:'Userlist',message:'',isAuth:req.isAuthenticated()});

    });
});

module.exports = router;
