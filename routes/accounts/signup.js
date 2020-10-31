const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { validationResult } = require("../../midleware/validator");
const SignupParamValidator = require("../../midleware/validators/signupParamValidator");

const wrap = require("../../helpers/async_wrapper");
const Mail = require("../../helpers/send_mail");

router.get("/", function (req, res, next) {
  res.render("pages/accounts/signup");
});

router.post(
  "/",
  SignupParamValidator,
  wrap(async function (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render("pages/accounts/signup", {
        errorMessage: result.array(),
      });
    }

    const { username, email, password } = req.body;

    let activationToken;
    try {
      activationToken = await User.createUser(username, email, password);
    } catch (err) {
      console.error(err);
      res.render("pages/accounts/signup", {
        errorMessage: [
          `This username(${username}) or email(${email}) is already used`,
        ],
      });
      return;
    }

    const url = `localhost:3000/accounts/activation/${activationToken}/edit?email=${encodeURIComponent(
      email
    )}`;

    const html = await Mail.buildHtml("activate_account", { username, url });
    const mailParam = {
      to: email,
      subject: "Account activation",
      html,
    };
    await Mail.send(mailParam);

    res.render("pages/index", {
      title: "MicroPost",
      message: "Email sent with activation instructions",
    });
  })
);

module.exports = router;
