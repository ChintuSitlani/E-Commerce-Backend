const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controllers');

router.post('/signup', sellerController.registerSeller);
router.post('/login', sellerController.loginSeller);

module.exports = router;
