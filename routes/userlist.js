const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  let currentPage;
  if (req.query.page === undefined) {
    currentPage = 1;
  } else {
    currentPage = parseInt(req.query.page);
  }
  knex("users")
    .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
    .then(function (result) {
      const userRows = JSON.parse(JSON.stringify(result.data));
      const pagination = result.pagination;

      res.render("userlist", {
        title: "Userlist",
        message: "",
        isAuth: req.isAuthenticated(),
        users: userRows,
        pagination: pagination,
      });
    });
});

module.exports = router;
