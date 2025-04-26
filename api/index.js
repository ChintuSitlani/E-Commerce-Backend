const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
// Middlewares
app.use(express.json());

// Import routes
const sellerRoutes = require('./routes/seller');
const productRoutes = require('./routes/product');

// Set up routes
app.use('/seller', sellerRoutes);
app.use('/products', productRoutes);

// Export the app for Vercel
module.exports = app;