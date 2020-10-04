const session = require("express-session");
const cookieParser = require("cookie-parser");

const secret = "secretCuisine123";

module.exports = function (app) {
  app.use(cookieParser(secret));
  app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000,
      },
    })
  );
};
