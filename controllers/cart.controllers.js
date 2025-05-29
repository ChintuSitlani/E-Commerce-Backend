const Cart = require('../models/cart.models');
const Coupon = require('../models/coupon.models');
const Product = require('../models/product.models');


exports.addToCart = async (req, res) => {
  const { userId, productId, quantity =1, taxRate, discountAmt, selected = true } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      if (typeof selected === 'boolean') {
        cartItem.selected = selected;
      }
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId,
        productId,
        quantity,
        taxRate: taxRate ?? product.taxRate ?? 0,
        discount: discountAmt ?? product.discountRate ?? 0,
        selected
      });
      await cartItem.save();
    }

    res.status(200).json(cartItem);
  } catch (err) {
    console.error('Add to cart error:', err);
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
exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { userId, productId, quantity, taxRate, discountAmt, selected } = req.body.cartItem || {};

  try {
    let cartItem;
    if (itemId) {
      cartItem = await Cart.findById(itemId);
    }
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    if (quantity !== undefined) cartItem.quantity = quantity;
    if (taxRate !== undefined) cartItem.taxRate = taxRate;
    if (discountAmt !== undefined) cartItem.discount = discountAmt;
    if (selected !== undefined) cartItem.selected = selected;

    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

exports.getCartSummary = async (req, res) => {
  const { userId, couponCode } = req.query;

  try {

    const cartItems = await Cart.find({ userId, selected: true }).populate('productId');
    let subTotal = 0;
    let taxTotal = 0;
    let itemDiscountTotal = 0;
    for (const item of cartItems) {
      const price = item.productId.priceExclTax;
      const quantity = item.quantity;

      const itemTotal = item.productId.priceExclTax * quantity;
      const discountAmount = item.productId.discountAmt > 0 ? item.productId.discountAmt * quantity : 0;
      const taxAmount = item.productId.taxRate > 0 ? (itemTotal  * item.productId.taxRate / 100) : 0;

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
