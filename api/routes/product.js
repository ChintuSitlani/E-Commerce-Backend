const express = require('express');
const router = express.Router();

// GET /products
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Smartphone' }
  ]);
});

module.exports = router;