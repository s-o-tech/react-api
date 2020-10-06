const knex = require("../db/knex");

const TABLE_NAME = "microposts";

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
  stats,
};
