const LocalStrategy = require("passport-local");
const User = require("../../models/user");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (username, password, done) {
    try {
      const user = await User.verify(username, password);
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(null, false, { message: err.toString() });
    }
  }
);
