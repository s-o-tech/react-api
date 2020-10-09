const User = require("../../models/user");

const handler = async function (req, res, next) {
  const userId = req.params.userid;

  const user = await User.find(userId);
  const following = await User.following(userId);

  res.render("pages/following", {
    current_user: req.user,
    user,
    title: "",
    message: "",
    isAuth: req.isAuthenticated(),
    following: following,
  });
};

module.exports = handler;
