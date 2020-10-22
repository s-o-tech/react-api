const bcrypt = require("bcrypt");
const crypto = require("crypto");
const knex = require("../db/knex");
const Relationship = require("./relationship");
const Micropost = require("./micropost");

const TABLE_NAME = "users";

async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await knex(TABLE_NAME)
    .insert({
      name: username,
      email: email,
      password: hashedPassword,
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
function updateByEmail(email, data) {
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
      return knex(TABLE_NAME).where({ email: email }).update(d);
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
        } else if (!user.isActivated) {
          throw new Error(
            "Account not activated. Check your email for the activation link."
          );
        }
        return user;
      });
    });
}

async function find(userId) {
  const user = await knex(TABLE_NAME)
    .where({ id: userId })
    .select("*")
    .then((results) => {
      if (results.length === 0) {
        throw new Error("User not found");
      }
      return results[0];
    });

  const relationshipStats = await Relationship.stats(userId);
  const micropostStats = await Micropost.stats(userId);

  return {
    ...user,
    ...relationshipStats,
    ...micropostStats,
  };
}

async function following(userId) {
  return await knex("relationships")
    .join(TABLE_NAME, "relationships.followed_id", "=", "users.id")
    .where({ follower_id: userId })
    .then((result) => result);
}

async function followers(userId) {
  return await knex("relationships")
    .join(TABLE_NAME, "relationships.follower_id", "=", "users.id")
    .where({ followed_id: userId })
    .then((result) => result);
}

async function generateResetToken(email) {
  const token = crypto.randomBytes(16).toString("hex");
  return await knex(TABLE_NAME)
    .where({ email: email })
    .update({
      reset_token: bcrypt.hashSync(token, 10),
      reset_limit: knex.fn.now(),
    })
    .then(() => {
      return token;
    });
}

async function generateActivationToken(email) {
  const token = crypto.randomBytes(16).toString("hex");
  return await knex(TABLE_NAME)
    .where({ email: email })
    .update({
      activation_token: bcrypt.hashSync(token, 10),
    })
    .then(() => {
      return token;
    });
}

async function activateUser(email) {
  return await knex(TABLE_NAME)
    .where({ email: email })
    .update({
      activation_token: null,
      isActivated: true,
      activated_at: knex.fn.now(),
    })
    .then((result) => result);
}

async function isExpired(email, token) {
  return await knex(TABLE_NAME)
    .where({ email: email })
    .select("*")
    .then((results) => {
      if (results.length === 0) {
        throw new Error("User not found");
      }
      const user = results[0];
      if (Date.parse(user.reset_limit) < Date.now() - 2 * 60 * 60 * 1000) {
        throw new Error("Token has expired. Please issue the token again.");
      } else if (!bcrypt.compareSync(token, user.reset_token)) {
        throw new Error("Token error. Please issue the token again.");
      }
    });
}

async function activationTokenVerify(email, token) {
  return await knex(TABLE_NAME)
    .where({ email: email })
    .select("*")
    .then((results) => {
      if (results.length === 0) {
        throw new Error("User not found");
      }
      const user = results[0];
      if (!bcrypt.compareSync(token, user.activation_token)) {
        throw new Error("Token error. Please issue the token again.");
      }
    });
}

async function exist(condition) {
  return await knex(TABLE_NAME)
    .where(condition)
    .then((results) => {
      return results.length !== 0;
    });
}

module.exports = {
  createUser,
  update,
  verify,
  find,
  following,
  followers,
  generateResetToken,
  generateActivationToken,
  activateUser,
  updateByEmail,
  isExpired,
  exist,
  activationTokenVerify,
};
