const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Connect to MongoDB
connectDB();
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
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