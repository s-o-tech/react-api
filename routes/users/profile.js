const User = require("../../models/user");
const Micropost = require("../../models/micropost");
const Relationship = require("../../models/relationship");

const handler = async function (req, res, next) {
  const userId = req.params.userid;

  let currentPage;
  if (req.query.page === undefined) {
    currentPage = 1;
  } else {
    currentPage = parseInt(req.query.page);
  }

  const user = await User.findById(userId);
  const microposts = await Micropost.findAll(userId, currentPage);

  let relationship = null;
  if (req.user.id !== userId) {
    relationship = await Relationship.find(req.user.id, userId);
  }

  res.render("pages/profile", {
    current_user: req.user,
    user,
    title: "",
    message: "",
    isAuth: req.isAuthenticated(),
    relationship: relationship,
    microposts: microposts,
    pagination: { currentPage: 0, lastPage: 0 },
  });
};

module.exports = handler;
