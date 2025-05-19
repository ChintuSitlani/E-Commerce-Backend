const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);
router.get('/buyer/:buyerId', orderController.getOrdersForBuyer);
router.get('/seller/:sellerId', orderController.getOrdersForSeller);

module.exports = router;
