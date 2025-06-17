const Buyer = require('../models/buyer.models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.js');
const authController = require('../controllers/auth.controllers.js');
const jwt = require('jsonwebtoken');

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
    if (updates.password) 
      if( updates.password.trim() !== '') 
        updates.password = await bcrypt.hash(updates.password, 10);
    

    const buyer = await Buyer.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(buyer);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.forgotPasswordByEmail = async (req, res) => {
  try{
    const { email , URL } = req.body;
    
    const buyer = await Buyer.findOne({ email });
    if (!buyer) return res.status(404).json({ message: 'User not found' });

    const token = generateToken(buyer, 'buyer', '15m');

   const resetLink = `${URL}?token=${token}`;

    authController.sendVerificationLink(req, res, resetLink, email);

    res.json({ message: 'Reset link sent to email' });
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : 'Error '+ err.message})
  }
};


exports.resetPasswordWithToken = async (req, res) => {
  
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);
    const buyer = await Buyer.findById(decoded.id);
    if (!buyer) return res.status(404).json({ message: 'Invalid user' });

    buyer.password = await bcrypt.hash(newPassword, 10);
    await buyer.save();
    // Generate a new token after password reset
    const newToken = generateToken(buyer, 'buyer');

    res.json({ 
      message: 'Password reset successful',
      newToken,
      buyer
     });
  } catch (err) {
    console.log('JWT Verification Error:', err);
    res.status(400).json({ message: 'Invalid or expired token' + err.message });
  }
};