const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  sellerId: { type: String, required: true },
  sellerEmailId: { type: String, required: true },
  taxRate: { type: Number, default: 0 },
  discountRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
