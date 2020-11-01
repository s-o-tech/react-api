const path = require("path");
const ejs = require("ejs");
const transport = require("../config/nodemailer");

async function buildHtml(template, data) {
  return ejs.renderFile(
    path.join(__dirname, "../views/email/", template + ".ejs"),
    data
  );
}

async function send(param) {
  const data = {
    from: "d.higashi+school@atomitech.jp",
    ...param,
  };

  console.log(data);

  return transport.sendMail(data, function (err) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
}

module.exports = {
  buildHtml,
  send,
};
