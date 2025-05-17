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
