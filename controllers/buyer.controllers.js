const Buyer = require('../models/buyer.models');
const connectDB = require('../db');

// Register Buyer
exports.registerBuyer = async (req, res) => {
  try {
    await connectDB();
    const buyer = await Buyer.create(req.body);
    res.status(201).json(buyer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login Buyer
exports.loginBuyer = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const buyer = await Buyer.findOne({ email, password });
    if (!buyer) return res.status(400).json({ message: 'Invalid credentials' });
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
