const express = require('express');
const router = express.Router();

// In-memory products array (temporary storage)
let products = [
  {
    id: '1',
    productName: 'Laptop',
    price: 50000,
    description: 'High performance laptop',
    imageUrl: 'https://example.com/laptop.jpg',
    sellerId: 'seller123',
    sellerEmailId: 'seller@example.com'
  },
  {
    id: '2',
    productName: 'Smartphone',
    price: 30000,
    description: 'Latest smartphone with AMOLED display',
    imageUrl: 'https://example.com/smartphone.jpg',
    sellerId: 'seller123',
    sellerEmailId: 'seller@example.com'
  }
];

// GET /products - fetch all products
router.get('/', (req, res) => {
  res.json(products);
});

// POST /products - add a new product
router.post('/', (req, res) => {
  const newProduct = req.body;

  // Generate a random ID for the product
  newProduct.id = Math.random().toString(36).substring(2, 8);

  // Push new product into the array
  products.push(newProduct);

  res.status(201).json(newProduct);
});

module.exports = router;
