const knex = require("../db/knex");

const TABLE_NAME = "microposts";

async function findAll(userId, currentPage) {
  const microposts = await knex(TABLE_NAME)
    .join("users", "microposts.user_id", "=", "users.id")
    .where({ user_id: userId })
    .select("*")
    .options({ nestTables: true })
    // .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
    .then((results) => {
      return results.map((x) => {
        return { ...x.microposts, user: x.users };
      });
    });

  return microposts;
}
async function stats(userId) {
  const count = await knex(TABLE_NAME)
    .count()
    .where("user_id", userId)
    .then(function (result) {
      return result[0]["count(*)"];
    });

  return { post_count: count };
}

async function insert(content, userId) {
  return knex(TABLE_NAME).insert({
    content: content,
    user_id: userId,
  });
}

async function del(userId, postId) {
  return knex(TABLE_NAME)
    .where({
      user_id: userId,
      id: postId,
    })
    .del();
}

module.exports = {
  findAll,
  stats,
  insert,
  del,
};
