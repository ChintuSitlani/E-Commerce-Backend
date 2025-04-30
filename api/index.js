const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
mongoose.set('bufferCommands', false);

let cachedDb = null;

// Connect to MongoDB and cache the connection
async function connectToDatabase() {
  if (cachedDb) return cachedDb;  // Return the cached DB connection if already established

  try {
    const uri = process.env.MONGO_URI; // Fetch MongoDB URI from environment variables

    if (!uri) {
      console.error("❌ MongoDB URI is missing. Please check your environment variables.");
      throw new Error("MongoDB URI not defined");
    }

    // Connect to MongoDB using the URI
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');
    cachedDb = conn;  // Cache the DB connection
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;  // Throw error if connection fails
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', require('./routes/product.routes'));
app.use('/seller', require('./routes/seller.routes'));
app.use('/buyer', require('./routes/buyer.routes'));
app.use('/cart', require('./routes/cart.routes'));

// Vercel Handler - Ensure DB is connected before handling requests
module.exports = async (req, res) => {
  try {
    await connectToDatabase();  // Ensure DB is connected
    return app(req, res);       // Let Express handle the request
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
