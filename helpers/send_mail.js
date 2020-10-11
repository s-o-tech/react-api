const nodemailer = require("nodemailer");

const smtpConfig = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  requiresAuth: true,
  auth: {
    user: "d.higashi+school@atomitech.jp",
    pass: "Dj!*m*5%asG3F^Ec",
  },
});

function activationConfig(username, url, email) {
  return {
    from: "d.higashi+school@atomitech.jp",
    to: email,
    subject: "Account activations",
    html: `
        <html>
            <head>
                <meta http-equiv="Content-Type" Content="text/html;charset=UTF-8">
            </head>
            <body>
                <h1>MicroPost</h1>
                <p>Hi ${username},</p>
                <p>Welcome to the Sample App! Click on the link below to activate your account:</p>
                <a href = '${url}'>${url}</a>
            <body>
        </html>
        `,
  };
}

function passwordResetConfig(url, email) {
  return {
    from: "d.higashi+school@atomitech.jp",
    to: email,
    subject: "Password reset",
    html: `
        <html>
            <head>
                <meta http-equiv="Content-Type" Content="text/html;charset=UTF-8">
            </head>
            <body>
                <h1>Password reset</h1>
                <p>To reset your password click the link below:</p>
                <p>This link will expire in two hours.</p>
                <a href = '${url}'>${url}</a>
                <p>
                If you did not request your password to be reset, please ignore this email and
                your password will stay as it is.
                </p>
            <body>
        </html>
        `,
  };
}

async function send(mailOptions) {
  return smtpConfig.sendMail(mailOptions, function (err) {
    if (err) {
      console.error(err);
      throw new Error("sendMail Error");
    }
  });
}

module.exports = {
  smtpConfig,
  passwordResetConfig,
  activationConfig,
  send,
};
