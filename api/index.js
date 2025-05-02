const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

const router = express.Router();
mongoose.set('bufferCommands', false);

let isConnected = false;

// Connect to MongoDB once before handling requests
async function connectToDatabase() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is missing");
    throw new Error("MONGO_URI not defined");
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB before all requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// Routes
const productRoutes = require('../routes/product.routes');
const sellerRoutes = require('../routes/seller.routes');
const buyerRoutes = require('../routes/buyer.routes');
const cartRoutes = require('../routes/cart.routes');

router.use('/products', productRoutes);
router.use('/seller', sellerRoutes);
router.use('/buyer', buyerRoutes);
router.use('/cart', cartRoutes);
app.use('/api', router);

module.exports = app;
module.exports.handler = serverless(app);
