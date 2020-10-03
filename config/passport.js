const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const knex = require("../db/knex");

module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(require("./passport/local"));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    knex
      .select("*")
      .from("users")
      .where({ id: user.id })
      .then(function (result) {
        return done(null, result);
      })
      .catch(function () {
        return done(null, false);
      });
  });

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
            return done(null, false, { message: "DB Error" });
          });
      }
    )
  );
};
