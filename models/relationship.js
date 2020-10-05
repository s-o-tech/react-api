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

function find(followerId, followedId) {
  return knex(TABLE_NAME)
    .where({ follower_id: followerId, followed_id: followedId })
    .then((results) => {
      if (results.length === 0) {
        throw new Error("Relationship not found");
      }
      return results[0];
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

module.exports = {
  create,
  find,
  remove,
};
