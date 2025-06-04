const Product = require('../models/product.models');


// Create Product
exports.createProduct = async (req, res) => {
  try {

    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Products (with optional seller filtering)
exports.getProducts = async (req, res) => {
  try {

    const filter = {};
    if (req.query.sellerId) filter.sellerId = req.query.sellerId;
    if (req.query.sellerEmail) filter.sellerEmail = req.query.sellerEmail;

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get Products with Filtering (search, brand, price range)
exports.getFilteredProducts = async (req, res) => {
  try {
    const {
      search = '',
      brand,
      minPrice = 0,
      maxPrice = 1000000,
      skip = 0,
      limit = 10
    } = req.query;

    const query = {
      productName: { $regex: search, $options: 'i' },
      priceExclTax: { $gte: Number(minPrice), $lte: Number(maxPrice) }
    };

    if (brand) {
      query.brand = {
        $regex: brand,
        $options: 'i',
        $exists: true // optional: ensures brand field exists
      };
    }

    const products = await Product.find(query)
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Crausal Product
exports.getCrausalProduct = async (req, res) => {
  try {
    const limit = parseInt(req.query._limit, 10) || 5;

    const crausalProduct = await Product.find().limit(limit);
    res.json(crausalProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
