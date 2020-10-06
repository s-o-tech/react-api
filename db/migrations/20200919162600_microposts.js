'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('microposts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('microposts', function(t) {
        t.increments('id').primary();
        t.string('content').notNullable();
        t.integer('user_id').notNullable();
        t.string('picture').nullable();
        t.timestamps()
      });
    }else{
      return new Error("The table already exists");
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('microposts').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('microposts');
    }
  });
};