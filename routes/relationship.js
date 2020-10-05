const express = require("express");
const router = express.Router();

const Relationship = require("../models/relationship");

router.post("/", function (request, response) {
  const user = request.user;
  const followedId = request.body.followed_id;

  Relationship.create(user.id, followedId)
    .then((result) => {
      response.redirect(`/users/${followedId}`);
    })
    .catch(function (err) {
      console.error(err);
      response.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: false,
      });
    });
});

// NOTE: FormではDELETEは利用できない(GET,POSTのみ可)
router.post("/delete", function (request, response) {
  const relationshipId = request.body.relationship_id;
  const followedId = request.body.followed_id;

  Relationship.remove(relationshipId)
    .then((result) => {
      response.redirect(`/users/${followedId}`);
    })
    .catch(function (err) {
      console.error(err);
      response.render("index", {
        title: "",
        errorMessage: [err.sqlMessage],
        isAuth: false,
      });
    });
});

module.exports = router;
