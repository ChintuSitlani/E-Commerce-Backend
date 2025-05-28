const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');

router.post('/add', cartController.addToCart);
router.delete('/:itemId', cartController.removeFromCart);
router.get('/summary', cartController.getCartSummary);
router.put('/:itemId', cartController.updateCartItem);
router.get('/:userId', cartController.getCartByUser);

module.exports = router;
