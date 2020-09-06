let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');

router.get('/',function(req,res,next){
    res.render('signup',{title:'Sign Up',errorMessage:'',isAuth:false/*req.isAuthenticated()*/});
});

router.post('/', function(req,res,next){
    let username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm,
        email = req.body.email;
    if(username == ''){
        res.render('signup',{title:'Sign Up',errorMessage:'invalid username',isAuth:false});
    }
    else if(password == ''){
        res.render('signup',{title:'Sign Up',errorMessage:'invalid password',isAuth:false});
    }
    else if(email == '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ){
        res.render('signup',{title:'Sign Up',errorMessage:'invalid email',isAuth:false});
    }
    else if(password != passwordConfirm){
        res.render('signup',{title:'Sign Up',errorMessage:'パスワードが一致していません',isAuth:false});
    }
    else {
        knex('user').insert({id:0,name:username,password:password,email:email})
        .then(function(resp){
            //あとで変更予定
            res.redirect('/');
        })
        .catch(function(err){
            console.error(err);
            res.render('signup',{title:'Sign Up',errorMessage:`This username(${username}) is already used`,isAuth:req.isAuthenticated()});
        }) 
    }
}
);
module.exports = router;
