const Category = require('../models/category.models.js');

exports.createCategory = async (req, res) => {
    try {

        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        const categoryName = req.body.name.trim();

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${categoryName}$`, 'i') }// Using regex for case-insensitive match 
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists',
                existingCategory: existingCategory
            });
        }

        const category = await Category.create({
            ...req.body,
            name: categoryName,
            subcategories: req.body.subcategories ?
                req.body.subcategories.map(sc => sc.trim()) : []
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.error('Error creating category:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists (database level)'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); // Alphabetical order
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories'
        });
    }
}