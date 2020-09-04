'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('user').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('user', function(t) {
        t.increments('id').primary();
        t.string('name');
        t.string('email');
      });
    }else{
      return new Error("The table already exists");
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('user').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('user');
    }
  });
};