const express = require('express');
const router = express.Router();

// POST /seller (signup)
router.post('/', (req, res) => {
  const sellerData = req.body;
  console.log('Seller Data:', sellerData);
  res.json({ message: 'Seller created successfully', seller: sellerData });
});

// POST /seller/login (login)
router.post('/login', (req, res) => {
  const { email, password } = req.body; // ✅ from body
});

module.exports = router;
