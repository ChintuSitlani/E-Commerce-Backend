const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyer.controllers');

router.post('/signup', buyerController.registerBuyer);
router.post('/login', buyerController.loginBuyer);

module.exports = router;
