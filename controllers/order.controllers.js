const Order = require('../models/order.models');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { buyerId, sellerId, items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      buyerId,
      sellerId,
      items,
      totalAmount,
      shippingAddress
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('sellerId')
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('sellerId')
      .populate('items.productId');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
};

// Get Orders for Buyer
exports.getOrdersForBuyer = async (req, res) => {
  try {
    const buyerId = req.params.buyerId;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { buyerId };

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('sellerId')
      .populate('items.productId')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({ total, page: Number(page), limit: Number(limit), orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buyer orders', details: err.message });
  }
};

// Get Orders for Seller
exports.getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { sellerId };

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .populate('sellerId')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({ total, page: Number(page), limit: Number(limit), orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seller orders', details: err.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
};
