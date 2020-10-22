const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  requiresAuth: true,
  auth: {
    user: "d.higashi+school@atomitech.jp",
    pass: "Dj!*m*5%asG3F^Ec",
  },
});

module.exports = transport;
