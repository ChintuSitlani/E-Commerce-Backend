const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  selected: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
