const Cart = require('../models/cart.models');
 
const Coupon = require('../models/coupon.models');

// Add product to cart
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
     
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

exports.getCartSummary = async (req, res) => {
  const { userId, couponCode } = req.query;
  console.error( userId, couponCode); // Log the userId and couponCode for debugging

  try {
     
    const cartItems = await Cart.find({ userId }).populate('productId');
    let subTotal = 0;
    let taxTotal = 0;
    let itemDiscountTotal = 0;
    console.error('Cart Items:', cartItems); 
    for (const item of cartItems) {
      const price = item.productId.price;
      const quantity = item.quantity;

      const itemTotal = price * quantity;
      const discountAmount = item.discount > 0 ? (item.discount / 100) * itemTotal : 0;
      const taxAmount = item.taxRate > 0 ? ((itemTotal - discountAmount) * item.taxRate / 100) : 0;

      subTotal += itemTotal;
      itemDiscountTotal += discountAmount;
      taxTotal += taxAmount;
    }

    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        let eligibleAmount = 0;

        if (coupon.applyTo === 'cart') {
          eligibleAmount = subTotal - itemDiscountTotal;
        } else {
          // Apply only to specific products
          const eligibleItems = cartItems.filter(item => coupon.productIds.includes(item.productId._id.toString()));
          eligibleAmount = eligibleItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        }

        if (coupon.discountType === 'percent') {
          couponDiscount = (coupon.discountValue / 100) * eligibleAmount;
        } else {
          couponDiscount = coupon.discountValue;
        }
      }
    }

    const total = subTotal - itemDiscountTotal - couponDiscount + taxTotal;

    res.status(200).json({
      subTotal,
      taxTotal,
      itemDiscountTotal,
      couponDiscount,
      total,
      cartItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching cart summary' });
  }
};
