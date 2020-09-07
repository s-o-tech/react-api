let express = require('express');
let router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');

router.get('/',function(req,res,next){
    res.render('edit',{title:'Edit User',errorMessage:[],isAuth:req.isAuthenticated()});
});

router.post('/', function(req,res,next){
    let userID = req.user.id,
        new_username = req.body.username,
        new_password = req.body.password,
        passwordConfirm = req.body.confirmation,
        new_email = req.body.email,
        errorMessage = [];
    if(new_username == ''){
        errorMessage.push("Username can't be blank");
    }
    if(new_password == ''){
        errorMessage.push("Password can't be blank");
    }
    if(new_email == '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(new_email)) ){
        errorMessage.push("Invalid Email");
    }
    if(new_password != passwordConfirm){
        errorMessage.push("Password doesn't match.");
    }

    if(errorMessage.length != 0){
        res.render('edit',{title:'Edit User',errorMessage:errorMessage,isAuth:req.isAuthenticated()});
    }
    else {
        new_password = bcrypt.hashSync(new_password,10);

        knex('users').where({id:userID}).update({name:new_username,password:new_password,email:new_email})
        .then(function(){
            res.render('index', {title:'MicroPost',message:`Welcome ${new_username}! Please check your email to activate your account.`,isAuth:req.isAuthenticated()});
        })
        .catch(function(err){
            console.error(err);
            //usernameが重複している場合
            if(/users.users_name_unique/.test(err.sqlMessage)){
                res.render('edit',{title:'Edit User',errorMessage:[`This username(${new_username}) is already used`],isAuth:req.isAuthenticated()});  
            }
            //emailが重複している場合
            else if(/users.users_email_unique/.test(err.sqlMessage)){
                res.render('edit',{title:'Edit User',errorMessage:[`This email(${new_email}) is already used`],isAuth:req.isAuthenticated()});  
            }
            //その他のエラーはSQLから出力された文をそのまま表示させます
            //ここの仕様は応相談
            else{
                res.render('edit',{title:'Edit User',errorMessage:[err.sqlMessage],isAuth:req.isAuthenticated()});
            }
        }) 
    }
}
);
module.exports = router;
