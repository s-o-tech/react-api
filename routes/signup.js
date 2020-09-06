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
        errorMessage.push('usernameが空欄です');
    }
    if(password == ''){
        errorMessage.push('passwordが空欄です');
    }
    if(email == '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ){
        errorMessage.push('emailが空欄です');
    }
    if(password != passwordConfirm){
        errorMessage.push('パスワードが一致していません');
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
