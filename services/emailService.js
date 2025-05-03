// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { EMAIL_USER, EMAIL_PASSWORD, BASE_URL } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
  
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `
      <h1>Please verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default {
  sendVerificationEmail,
};