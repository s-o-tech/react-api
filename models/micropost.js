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

module.exports = {
  findAll,
  stats,
};
