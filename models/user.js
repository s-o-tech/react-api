const knex = require("../db/knex");
const bcrypt = require("bcrypt");

const TABLE_NAME = "users";

function createUser(username, email, password) {
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return knex(TABLE_NAME).insert({
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
  return knex(TABLE_NAME)
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

function following(userId) {
  return knex("relationships")
    .join("users", "relationships.followed_id", "=", "users.id")
    .where({ follower_id: userId });
}

function followers(userId) {
  return knex("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: userId });
}

module.exports = {
  createUser,
  verify,
  following,
  followers,
};
