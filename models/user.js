const bcrypt = require("bcrypt");
const crypto = require("crypto");
const knex = require("../db/knex");
const Relationship = require("./relationship");
const Micropost = require("./micropost");

const TABLE_NAME = "users";

async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Activation token
  const token = crypto.randomBytes(16).toString("hex");
  const hashedToken = await bcrypt.hash(token, 10);

  await knex(TABLE_NAME).insert({
    name: username,
    email: email,
    password: hashedPassword,
    activation_token: hashedToken,
  });

  return token;
}

async function update(id, data) {
  const { password, ...rest } = data;
  let d = { ...rest };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    d = { ...d, password: hashedPassword };
  }
  return await knex(TABLE_NAME).where({ id: id }).update(d);
}

async function updateByEmail(email, data) {
  const { password, ...rest } = data;
  let d = { ...rest };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    d = { ...d, password: hashedPassword };
  }
  return await knex(TABLE_NAME).where({ email: email }).update(d);
}

async function verify(email, password) {
  return await knex(TABLE_NAME)
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

async function findById(userId) {
  const user = await knex(TABLE_NAME)
    .where({ id: userId })
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

async function where(condition) {
  return await knex(TABLE_NAME)
    .where(condition)
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
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

async function generateResetToken(userId) {
  const token = crypto.randomBytes(16).toString("hex");
  const hashedToken = await bcrypt.hash(token, 10);

  return await knex(TABLE_NAME)
    .where({ id: userId })
    .update({
      reset_token: hashedToken,
      reset_limit: knex.fn.now(),
    })
    .then(() => {
      return token;
    });
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

async function activate(user, token) {
  if (!(await bcrypt.compare(token, user.activation_token))) {
    throw new Error("Token error. Please issue the token again.");
  }

  return await knex(TABLE_NAME)
    .where({ id: user.id })
    .update({
      activation_token: null,
      isActivated: true,
      activated_at: knex.fn.now(),
    })
    .then((result) => result);
}

module.exports = {
  createUser,
  update,
  verify,
  findById,
  where,
  following,
  followers,
  generateResetToken,
  activate,
  updateByEmail,
  isExpired,
};
