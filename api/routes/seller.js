const express = require('express');
const router = express.Router();

// POST /seller
router.post('/', (req, res) => {
  const sellerData = req.body;
  console.log('Seller Data:', sellerData);
  res.json({ message: 'Seller created successfully', seller: sellerData });
});

module.exports = router;