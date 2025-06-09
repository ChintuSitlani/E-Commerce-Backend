const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../utils/jwt');

router.post('/', verifyToken, productController.createProduct);
router.get('/filteredProduct', productController.getFilteredProducts);
router.get('/getHomeScreenProducts', productController.getProducts);
router.get('/getCrausalProduct', productController.getCrausalProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
