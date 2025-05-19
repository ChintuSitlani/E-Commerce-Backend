const Coupon = require('../models/coupon.models');

exports.createCoupon = async (req, res) => {
    const { code, discountType, discountValue, applyTo, productIds } = req.body;
    try {
        const coupon = new Coupon({
            code,
            discountType,
            discountValue,
            applyTo,
            productIds
        });
        await coupon.save();
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create coupon' });
    }
}

exports.getCoupons = async (req, res) => {
    const { code } = req.params;
    if (code) {
        try {
            const coupon = await Coupon.findOne({ code });
            if (!coupon) {
                return res.status(404).json({ error: 'Coupon not found' });
            }
            try {
                const coupons = await Coupon.find();
                res.status(200).json(coupons);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch coupons' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch the coupon' });
        }
    } else {
        const error = new Error('Coupon code is required');
        error.statusCode = 400;
        res.status(400).json({ error: error.message });
    }
}

exports.updateCoupon = async (req, res) => {
    const { code } = req.params;
    const { discountType, discountValue, applyTo, productIds } = req.body;
    try {
        const coupon = await Coupon.findOneAndUpdate(
            { code },
            { discountType, discountValue, applyTo, productIds },
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update coupon' });
    }
}

exports.deleteCoupon = async (req, res) => {
    const { code } = req.params;
    try {
        const coupon = await Coupon.findOneAndDelete({ code });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
}
