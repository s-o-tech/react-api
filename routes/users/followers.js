const User = require("../../models/user");

const handler = async function (req, res, next) {
  const userId = req.params.userid;

  const user = await User.find(userId);
  const followers = await User.followers(userId);

  res.render("pages/followers", {
    current_user: req.user,
    user,
    title: "",
    message: "",
    isAuth: req.isAuthenticated(),
    followers: followers,
  });
};

module.exports = handler;
