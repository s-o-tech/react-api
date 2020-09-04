'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('micropost').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('micropost', function(t) {
        t.increments('id').primary();
        t.string('content');
        t.integer('user_id');
      });
    }else{
      return new Error("The table already exists");
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('micropost').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('micropost');
    }
  });
};