'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('name').unique();
        t.string('email').unique();
        t.string('password').not;
        t.boolean('isAdmin').defaultTo(false);
      });
    }else{
      return new Error("The table already exists");
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('users');
    }
  });
};