const passport = require("passport");
const cookieSession = require("cookie-session");
const User = require("../models/user");

const secret = "secretCuisine123";

module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.find(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(require("./passport/local"));

  app.use(
    cookieSession({
      name: "session",
      keys: [secret],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
