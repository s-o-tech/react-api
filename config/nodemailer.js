const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  requiresAuth: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transport;
