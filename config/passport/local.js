const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const knex = require("../../db/knex");

module.exports = new LocalStrategy(
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
);
