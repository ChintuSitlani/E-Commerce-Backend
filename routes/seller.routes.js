const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controllers');
const { verifyToken } = require('../utils/jwt');

router.post('/signup', sellerController.registerSeller);
router.post('/login', sellerController.loginSeller);
router.put('/update/:id', verifyToken, sellerController.updateSellerInfo);
router.post('/forgot-password', sellerController.forgotPasswordByEmail);
router.post('/reset-password/:token', sellerController.resetPasswordWithToken);

module.exports = router;
