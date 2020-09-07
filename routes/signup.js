let express = require('express');
let router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');

router.get('/',function(req,res,next){
    res.render('signup',{title:'Sign Up',errorMessage:[],isAuth:req.isAuthenticated()});
});

router.post('/', function(req,res,next){
    let username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.confirmation,
        email = req.body.email,
        errorMessage = [];
    if(username == ''){
        errorMessage.push("Username can't be blank");
    }
    if(password == ''){
        errorMessage.push("Password can't be blank");
    }
    if(email == '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ){
        errorMessage.push("Invalid Email");
    }
    if(password != passwordConfirm){
        errorMessage.push("Password doesn't match.");
    }

    if(errorMessage.length != 0){
        res.render('signup',{title:'Sign up',errorMessage:errorMessage,isAuth:req.isAuthenticated()});
    }
    else {
        password = bcrypt.hashSync(password,10);
        knex('users').insert({id:0,name:username,password:password,email:email})
        .then(function(){
            res.render('index', {title:'MicroPost',message:`Welcome ${username}! Please check your email to activate your account.`,isAuth:req.isAuthenticated()});
        })
        .catch(function(err){
            console.error(err);
            //usernameが重複している場合
            if(/users.users_name_unique/.test(err.sqlMessage)){
                res.render('signup',{title:'Sign up',errorMessage:[`This username(${username}) is already used`],isAuth:req.isAuthenticated()});  
            }
            //emailが重複している場合
            else if(/users.users_email_unique/.test(err.sqlMessage)){
                res.render('signup',{title:'Sign up',errorMessage:[`This email(${email}) is already used`],isAuth:req.isAuthenticated()});  
            }
            //その他のエラーはSQLから出力された文をそのまま表示させます
            //ここの仕様は応相談
            else{
                res.render('signup',{title:'Sign up',errorMessage:[err.sqlMessage],isAuth:req.isAuthenticated()});
            }
        }) 
    }
}
);
module.exports = router;
