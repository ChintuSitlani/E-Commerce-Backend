const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');

router.post('/add', cartController.addToCart);
router.delete('/:itemId', cartController.removeFromCart);
router.get('/summary', cartController.getCartSummary);
router.put('/:itemId', cartController.updateQuantity);
router.get('/:userId', cartController.getCartByUser);
router.put('/selected/:itemId', cartController.updateSelected);

module.exports = router;
