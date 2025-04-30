const Cart = require('../models/cart.models');
const connectDB = require('../db');

// Add product to cart
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    await connectDB();
    let item = await Cart.findOne({ userId, productId });
    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = new Cart({ userId, productId });
      await item.save();
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Get user's cart
exports.getCartByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await connectDB();
    const cartItems = await Cart.find({ userId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    await connectDB();
    await Cart.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.updateQuantity = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    await connectDB();
    const updatedItem = await Cart.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};
