const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCartByUser);
router.delete('/:itemId', cartController.removeFromCart);
router.put('/:itemId', cartController.updateQuantity);

module.exports = router;
