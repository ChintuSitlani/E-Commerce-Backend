const Buyer = require('../models/buyer.models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.js');
const authController = require('../controllers/auth.controllers.js');
const jwt = require('jsonwebtoken');

// Helper function for consistent error responses
const errorResponse = (res, status, message) => res.status(status).json({ message });

// Register Buyer
exports.registerBuyer = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const trimmedPassword = password?.trim();

    if (!trimmedPassword) {
      return errorResponse(res, 400, 'Password is required');
    }

    const buyer = await Buyer.create({
      ...rest,
      password: trimmedPassword 
    });

    const token = generateToken(buyer, 'buyer');

    return res.status(201).json({
      message: 'Registration successful',
      token,
      buyer
    });
  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === 11000) {
      return errorResponse(res, 409, 'Buyer already exists with this email');
    }
    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, err.message);
    }
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Login Buyer
exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const buyer = await Buyer.findOne({ email }).select('+password');
    if (!buyer) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password.trim(), buyer.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(buyer, 'buyer');

    return res.json({
      message: 'Login successful',
      token,
      buyer
    });
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Update Buyer Info
exports.updateBuyerInfo = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'shippingAddress', 'pin', 'phone',
      'country', 'state', 'city'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedFields.includes(key) && req.body[key] !== undefined)
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found');
    }

    Object.assign(buyer, updates);
    const updatedBuyer = await buyer.save();

    return res.json({
      message: 'Profile updated successfully',
      buyer: updatedBuyer
    });
  } catch (err) {
    console.error('Update error:', err);
    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, err.message);
    }
    return errorResponse(res, 500, 'Internal server error');
  }
};
// Forgot Password
exports.forgotPasswordByEmail = async (req, res) => {
  try {
    const { email, URL } = req.body;

    if (!email || !URL) {
      return errorResponse(res, 400, 'Email and URL are required');
    }

    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return errorResponse(res, 200, 'If this email exists, a reset link will be sent');
    }

    const token = generateToken(buyer, 'buyer', '15m');
    const resetLink = `${URL}?token=${encodeURIComponent(token)}&userType=buyer`;

    await authController.sendVerificationLink(req, res, resetLink, email);

    return res.json({ message: 'If this email exists, a reset link will be sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Reset Password
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await Buyer.findById(decoded.id);

    if (!buyer) {
      return errorResponse(res, 404, 'Invalid user');
    }

    buyer.password = newPassword.trim();
    await buyer.save()

    return res.json({
      message: 'Password reset successful',
      buyer
    });
  } catch (err) {
    console.error('Password reset error:', err);
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token');
    }
    return errorResponse(res, 500, 'Internal server error');
  }
};