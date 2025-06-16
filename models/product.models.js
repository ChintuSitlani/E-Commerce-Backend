const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true,
    validate: {
      validator: async function (subcategory) {
        if (!subcategory) return true; 
        const category = await mongoose.model('Category').findById(this.category);
        return category?.subcategories?.includes(subcategory);
      },
      message: 'Subcategory does not exist in the selected category'
    }
  },
  priceExclTax: { type: Number, required: true },
  stock: { type: Number, required: true },
  brand: { type: String },
  color: { type: String },
  weight: { type: String },
  material: { type: String },
  warranty: { type: String },
  rating: { type: Number, default: 0 },
  features: { type: String },
  specifications: { type: String },
  videoUrl: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  sellerId: { type: String, required: true },
  sellerEmailId: { type: String, required: true },
  taxRate: { type: Number, default: 0 },
  discountAmt: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
