const passport = require("passport");
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
};
