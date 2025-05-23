const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      taxRate: { type: Number, default: 0 },
      discount: { type: Number, default: 0 }
    }
  ],
  totalAmount: { type: Number, required: true },
  taxTotal: {type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  shippingCharges: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'COD', 'UPI'],
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    line1: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  billingAddress: {
    line1: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
