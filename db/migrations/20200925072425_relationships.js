'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('relationships').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('relationships', function(t) {
        t.increments('id').primary();
        t.integer('follower_id');
        t.integer('followed_id');
        t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
        t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
      });
    }else{
      return new Error("The table already exists");
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('relationships').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('relationships');
    }
  });
};