const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyer.controllers');
const { verifyToken } = require('../utils/jwt');

router.post('/signup', buyerController.registerBuyer);
router.post('/login', buyerController.loginBuyer);
router.put('/update/:id', verifyToken, buyerController.updateBuyerInfo);
router.post('/forgot-password', buyerController.forgotPasswordByEmail);
router.post('/reset-password/:token', buyerController.resetPasswordWithToken);

module.exports = router;
