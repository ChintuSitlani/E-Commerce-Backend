const Buyer = require('../models/buyer.models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.js');

// Register Buyer
exports.registerBuyer = async (req, res) => {
 try {
    const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10);

    const buyer = await Buyer.create({ ...req.body, password: hashedPassword });

    // ✅ Generate JWT Token Immediately
    const token = generateToken(buyer, 'buyer');

    res.status(201).json({
      message: 'Registration successful',
      token,
      buyer
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(400).json({ message: 'buyer not found for this email-ID' });
    }
    const isMatch = await bcrypt.compare(password.trim(), buyer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(buyer, 'buyer');
    
    res.json({
      message: 'Login successful',
      token,
      buyer
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateBuyerInfo = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'password',
      'shippingAddress',
      'pin',
      'phone',
      'country',
      'state',
      'city'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Manually hash the password if it's being updated because the pre-save hook won't run with findByIdAndUpdate
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const buyer = await Buyer.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(buyer);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

