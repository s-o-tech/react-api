"use strict";
const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 0,
          name: "admin",
          email: "admin@example.com",
          password: bcrypt.hashSync("password", 10),
          isAdmin: true,
        },
        {
          id: 0,
          name: "test",
          email: "test@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test1",
          email: "test1@example.com",
          password: bcrypt.hashSync("test1", 10),
          isAdmin: false,
        },        
        {
          id: 0,
          name: "test2",
          email: "test2@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },        
        {
          id: 0,
          name: "test3",
          email: "test3@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test4",
          email: "test4@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test5",
          email: "test5@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test6",
          email: "test6@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test7",
          email: "test7@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test8",
          email: "test8@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test9",
          email: "test9@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
        {
          id: 0,
          name: "test10",
          email: "test10@example.com",
          password: bcrypt.hashSync("test", 10),
          isAdmin: false,
        },
      ]);
    });
};
