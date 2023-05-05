// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");
// CHECK THIS VIDEO  :  https://www.youtube.com/watch?v=Y_u5KIeXiVI&ab_channel=DAIMTODeveloperTips
let transporter;
exports.setMailing = () => {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

exports.sendEmail = async (to, token, redirect) => {
  const resetLink = `${redirect}?token=${token}`;
  const mailOptions = {
    from: `Do Not Reply ${process.env.EMAIL}`,
    to,
    subject: "Reset your password",
    html: `
    <div style="background-color: #f5f5f5; padding: 20px;">
      <h1 style="color: #333;">Rapid Routes</h1>
      <p style="color: #777;">Reset password</p>
      <a href="${resetLink}">
      Click Here</a>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
