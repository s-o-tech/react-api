const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;

const knex = require("./db/knex");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new RememberMeStrategy(
    function(token, done) {
      Token.consume(token, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    },
    function(user, done) {
      const token = crypto.randomBytes(64).toString("hex");
      Token.save(token, { userId: user.id }, function(err) {
        if (err) { return done(err); }
        return done(null, token);
      });
    }
));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      knex
        .select("*")
        .from("users")
        .where({ email: username })
        .then(function (rows) {
          const users = Object.values(JSON.parse(JSON.stringify(rows)));

          if (!users[0] || users.length !== 1) {
            return done(null, false, { message: "Invalid Email" });
          } else if (!bcrypt.compareSync(password, users[0].password)) {
            return done(null, false, { message: "Invalid Password" });
          } else {
            return done(null, users[0]);
          }
        })
        .catch(function (err) {
          console.error(err);
          return done(null, false, { message: "Error" });
        });
    }
  )
);

// router
app.use("/", require("./routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
