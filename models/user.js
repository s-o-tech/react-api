const knex = require("../db/knex");
const bcrypt = require("bcrypt");

function createUser(username, email, password) {
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return knex("users").insert({
        name: username,
        email: email,
        password: hashedPassword,
      });
    })
    .then((result) => {
      return result;
    });
}

function verify(email, password) {
  return knex("users")
    .where({ email: email })
    .select("*")
    .then((results) => {
      if (results.length === 0) {
        throw new Error("User not found");
      }

      const user = results[0];
      return bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          throw new Error("Invalid password");
        }
        return user;
      });
    });
}

module.exports = {
  createUser,
  verify,
};
