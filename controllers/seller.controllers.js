const Seller = require('../models/seller.models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.js');
const authController = require('../controllers/auth.controllers.js');
const jwt = require('jsonwebtoken');

// Helper function for error responses
const errorResponse = (res, status, message) => res.status(status).json({ message });

// Register Seller
exports.registerSeller = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      return errorResponse(res, 400, 'Password is required');
    }

    const seller = await Seller.create({
      ...rest,
      password: trimmedPassword 
    });

    const token = generateToken(seller, 'seller');

    return res.status(201).json({
      message: 'Registration successful',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === 11000) {
      return errorResponse(res, 409, 'Seller already exists with this email');
    }
    if (err.name === 'ValidationError') {
      return errorResponse(res, 400, err.message);
    }
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password.trim(), seller.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(seller, 'seller');

    return res.json({
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Update Seller Info
exports.updateSellerInfo = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'shippingAddress', 'pin', 'phone',
      'country', 'state', 'city', 'password'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedFields.includes(key) && req.body[key] !== undefined)
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return errorResponse(res, 404, 'Seller not found');
    }

    Object.assign(seller, updates);
    const updatedSeller = await seller.save();

    return res.json({
      message: 'Profile updated successfully',
      seller: updatedSeller
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

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return errorResponse(res, 404, 'If this email exists, a reset link will be sent');
    }

    const token = generateToken(seller, 'seller', '15m');
    const resetLink = `${URL}?token=${encodeURIComponent(token)}&userType=seller`;

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
    const seller = await Seller.findById(decoded.id);

    if (!seller) {
      return errorResponse(res, 404, 'Invalid user');
    }

    seller.password = newPassword.trim();
    await seller.save();

    const newToken = generateToken(seller, 'seller');

    return res.json({
      message: 'Password reset successful',
      newToken,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
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