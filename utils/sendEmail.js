const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log("Connected to email server");
  const mailOpts = {
    from: `"E-shop App" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log("Mail sent successfully:", mailOpts.messageId);

  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
