var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var signinRouter = require('./routes/signin');

var knex = require('./db/knex');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
  emailField: "email", 
  passwordField: "password", 
},function(email, password, done) {
  knex.select('*').from('users').where({email:email})
  .then(function(rows){
    let users = Object.values(JSON.parse(JSON.stringify(rows)));
    if(!users[0] || users.length != 1){
      return done(null,false,{message:'Invalid UserName'});
    }
    else if(users[0].password != password){
      return done(null,false,{message:"Invalid Password"});
    }
    else{
      return done(null,users[0]);
    }
  })
  .catch(function(err){
    console.error(err);
    return done(null,false,{message:'error'});
  })
}
));

//route
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup',signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
