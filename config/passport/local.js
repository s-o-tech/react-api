const LocalStrategy = require("passport-local");
const User = require("../../models/user");
const wrap = require("../../helpers/async_wrapper");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  wrap(async function (username, password, done) {
    try {
      const user = await User.verify(username, password);
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(null, false, { message: err.toString() });
    }
  })
);
