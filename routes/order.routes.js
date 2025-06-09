const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');
const { verifyToken } = require('../utils/jwt');

router.post('/', verifyToken, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', verifyToken, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, orderController.deleteOrder);
router.get('/buyer/:buyerId', verifyToken, orderController.getOrdersForBuyer);
router.get('/seller/:sellerId', verifyToken, orderController.getOrdersForSeller);

module.exports = router;
