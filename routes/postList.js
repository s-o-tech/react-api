const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  const userId = req.user.id;
  const userName = req.user.name;
  const url = req.baseUrl.slice(1);

  let currentPage;
  if (req.query.page === undefined) {
    currentPage = 1;
  } else {
    currentPage = parseInt(req.query.page);
  }

  knex("micropost")
    .where("user_id", userId)
    .paginate({ perPage: 10, currentPage: currentPage, isLengthAware: true })
    .then(function (result) {
      const microposts = JSON.parse(JSON.stringify(result.data));
      const pagination = result.pagination;
      res.render(url, {
        title: "",
        message: "",
        isAuth: req.isAuthenticated(),
        userName: userName,
        microposts: microposts,
        pagination: pagination,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render(url, {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: req.isAuthenticated(),
      });
    });
});

module.exports = router;
