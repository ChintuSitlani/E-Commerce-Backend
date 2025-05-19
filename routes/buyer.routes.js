const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyer.controllers');

router.post('/signup', buyerController.registerBuyer);
router.post('/login', buyerController.loginBuyer);
router.put('/update/:id', buyerController.updateBuyerInfo);

module.exports = router;
