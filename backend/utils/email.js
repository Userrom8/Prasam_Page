import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1) Create a transporter (service that will send the email, e.g., Gmail, SendGrid)
  // IMPORTANT: For Gmail, you may need to use an "app password" if 2FA is enabled.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
