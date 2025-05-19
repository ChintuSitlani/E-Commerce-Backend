const couponController = require('../controllers/coupon.controllers');
const express = require('express');
const router = express.Router();

router.post('/create', couponController.createCoupon);
router.get('/:code?', couponController.getCoupons);
router.put('/:code', couponController.updateCoupon);
router.delete('/:code', couponController.deleteCoupon);

module.exports = router;