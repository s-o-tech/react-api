const crypto = require("crypto");

function gravatarUrl(user, size) {
  const gravatarId = crypto
    .createHash("md5")
    .update(user.email.toLowerCase())
    .digest("hex");
  return `https://secure.gravatar.com/avatar/${gravatarId}?s=${size}`;
}

module.exports = {
  gravatarUrl,
};
