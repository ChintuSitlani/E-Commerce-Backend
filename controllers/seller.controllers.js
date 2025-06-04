const Seller = require('../models/seller.models');
const bcrypt = require('bcrypt');

// Register Seller
exports.registerSeller = async (req, res) => {
  try {
    
    const seller = await Seller.create({ ...req.body});
    res.status(201).json(seller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Seller not found for this email ID' });
    }

    const isMatch = await bcrypt.compare(password.trim(), seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json(seller);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateSellerInfo = async (req, res) => {
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

    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedSeller);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};