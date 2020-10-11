const LocalStrategy = require("passport-local");
const User = require("../../models/user");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  function (username, password, done) {
    User.verify(username, password)
      .then(function (user) {
        return done(null, user);
      })
      .catch(function (err) {
        console.error(err);
        return done(null, false, { message: err.toString() });
      });
  }
);
