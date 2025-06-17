const Otp = require('../models/otp.models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Buyer = require('../models/buyer.models');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await Otp.findOneAndDelete({ email });

  const newOtp = new Otp({ email, otp, expiresAt });
  await newOtp.save();

  await transporter.sendMail({
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`
  });

  res.json({ message: 'OTP sent to email' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(400).json({ message: 'OTP not found' });

  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

  await Otp.deleteOne({ email });
  buyer.isEmailVerified = true;
  await buyer.save();
  res.json({ message: 'OTP verified successfully' });
};

exports.sendVerificationLink = async (req, res, resetLink, email) => {
  try {
    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: verificationEmailTemplate(resetLink, process.env.EMAIL_USER)
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error sending verification link ' + err.message });
  }
}

const verificationEmailTemplate = (resetLink , supportEmail) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .content {
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 15px 0;
        }
        .footer {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 20px;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">Password Reset Request</div>
    <div class="content">
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p>
            <a href="${resetLink}" class="button">Reset Password</a>
        </p>
        <p>If you didn't request this, please ignore this email or contact support if you have any concerns.</p>
    </div>
    <div class="content">
        <p>Alternatively, you can copy and paste this link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
    </div>
    <div class="footer">
        <p>Best regards,</p>
        <p>The Support Team</p>
        <p>"${supportEmail}"</p>
    </div>
</body>
</html>`
}