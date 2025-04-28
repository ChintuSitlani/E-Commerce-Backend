const Seller = require('../models/seller.models');

// Register Seller
exports.registerSeller = async (req, res) => {
  try {
    const seller = await Seller.create(req.body);
    res.status(201).json(seller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email, password });
    if (!seller) return res.status(400).json({ message: 'Invalid credentials' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
