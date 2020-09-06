'use strict';
const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 0,name: 'admin',email: 'admin@example.com',password:bcrypt.hashSync('password',10),isAdmin: true},
        {id: 0,name: 'test',email: 'test@example.com',password:bcrypt.hashSync('test',10),isAdmin: false},
        {id: 0,name: 'test1',email: 'test1@example.com',password:bcrypt.hashSync('test1',10),isAdmin: false},
      ]);
    });
};
