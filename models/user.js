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

function update(id, data) {
  const { password, ...rest } = data;
  return Promise.resolve()
    .then(() => {
      if (password) {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hashedPassword) => {
      let d = { ...rest };
      if (hashedPassword) {
        d = { ...d, password: hashedPassword };
      }
      return knex(TABLE_NAME).where({ id: id }).update(d);
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
    .join(TABLE_NAME, "relationships.followed_id", "=", "users.id")
    .where({ follower_id: userId });
}

function followers(userId) {
  return knex("relationships")
    .join(TABLE_NAME, "relationships.follower_id", "=", "users.id")
    .where({ followed_id: userId });
}

module.exports = {
  createUser,
  update,
  verify,
  following,
  followers,
};