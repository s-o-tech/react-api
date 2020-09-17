"use strict";

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("micropost")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("micropost").insert([
        {
          id: 0,
          content: "aaa",
          user_id: 1,
        },
        {
          id: 0,
          content: "bbb",
          user_id: 1,
        },
        {
          id: 0,
          content: "ccc",
          user_id: 1,
        },
        {
          id: 0,
          content: "ddd",
          user_id: 1,
        },
        {
          id: 0,
          content: "eee",
          user_id: 1,
        },
        {
          id: 0,
          content: "fff",
          user_id: 1,
        },
        {
          id: 0,
          content: "ggg",
          user_id: 1,
        },
        {
          id: 0,
          content: "hhh",
          user_id: 1,
        },
        {
          id: 0,
          content: "iii",
          user_id: 1,
        },
        {
          id: 0,
          content: "jjj",
          user_id: 1,
        },
        {
          id: 0,
          content: "kkk",
          user_id: 1,
        },
        {
          id: 0,
          content: "lll",
          user_id: 1,
        },
        {
          id: 0,
          content: "mmm",
          user_id: 1,
        },
        {
          id: 0,
          content: "nnn",
          user_id: 1,
        },
        {
          id: 0,
          content: "ooo",
          user_id: 1,
        },
        {
          id: 0,
          content: "ppp",
          user_id: 1,
        },
        {
          id: 0,
          content: "qqq",
          user_id: 1,
        },
        {
          id: 0,
          content: "rrr",
          user_id: 1,
        },
        {
          id: 0,
          content: "sss",
          user_id: 1,
        },
        {
          id: 0,
          content: "ttt",
          user_id: 1,
        },
        {
          id: 0,
          content: "uuu",
          user_id: 1,
        },
        {
          id: 0,
          content: "vvv",
          user_id: 1,
        },
        {
          id: 0,
          content: "www",
          user_id: 1,
        },
        {
          id: 0,
          content: "xxx",
          user_id: 1,
        },
        {
          id: 0,
          content: "yyy",
          user_id: 2,
        },
        {
          id: 0,
          content: "zzz",
          user_id: 3,
        },
      ]);
    });
};
