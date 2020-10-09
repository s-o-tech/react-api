const knex = require("../db/knex");

const TABLE_NAME = "relationships";

function create(followerId, followedId) {
  return knex(TABLE_NAME)
    .insert({
      follower_id: followerId,
      followed_id: followedId,
    })
    .then((result) => {
      return result;
    });
}

async function find(followerId, followedId) {
  return await knex(TABLE_NAME)
    .where({ follower_id: followerId, followed_id: followedId })
    .then((results) => {
      if (results.length === 0) {
        return null;
      } else {
        return results[0];
      }
    });
}

function remove(id) {
  return knex(TABLE_NAME)
    .where({ id: id })
    .del()
    .then((result) => {
      return result;
    });
}

async function stats(userId) {
  const followingCount = await knex(TABLE_NAME)
    .count()
    .where({ follower_id: userId })
    .then((result) => {
      return result[0]["count(*)"];
    });

  const followerCount = await knex(TABLE_NAME)
    .count()
    .where({ followed_id: userId })
    .then((result) => {
      return result[0]["count(*)"];
    });

  return {
    following_count: followingCount,
    follower_count: followerCount,
  };
}

module.exports = {
  create,
  find,
  remove,
  stats,
};
