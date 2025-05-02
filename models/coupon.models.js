const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percent', 'amount'], required: true },
  discountValue: { type: Number, required: true },
  applyTo: { type: String, enum: ['cart', 'product'], default: 'cart' },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
