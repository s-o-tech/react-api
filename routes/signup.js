let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');

router.get('/',function(req,res,next){
    res.render('signup',{title:'Sign Up',errorMessage:[],isAuth:false/*req.isAuthenticated()*/});
});

router.post('/', function(req,res,next){
    let username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm,
        email = req.body.email,
        errorMessage = [];
    if(username == ''){
        errorMessage.push("username can't be blank");
    }
    if(password == ''){
        errorMessage.push("password can't be blank");
    }
    if(email == '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ){
        errorMessage.push("email is invalid");
    }
    if(password != passwordConfirm){
        errorMessage.push("Password doesn't match.");
    }

    if(errorMessage.length != 0){
        res.render('signup',{title:'Sign up',errorMessage:errorMessage,isAuth:false});
    }
    else {
        knex('user').insert({id:0,name:username,password:password,email:email})
        .then(function(resp){
            //あとで変更予定
            res.redirect('/');
        })
        .catch(function(err){
            console.error(err);
            res.render('signup',{title:'Sign up',errorMessage:[`This username(${username}) is already used`],isAuth:false});
        }) 
    }
}
);
module.exports = router;
