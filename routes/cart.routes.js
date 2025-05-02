const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCartByUser);
router.delete('/:itemId', cartController.removeFromCart);
router.get('/test', (req, res) => {
    console.log('✅ /api/cart/test called');
    res.send('Cart test working');
  });
router.put('/:itemId', cartController.updateQuantity);
 console.log('cart routes loaded');
router.get('/summary', cartController.getCartSummary);

module.exports = router;
