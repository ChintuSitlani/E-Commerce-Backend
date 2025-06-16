const categoryController = require('../controllers/category.controllers.js');
const express = require('express');
const router = express.Router();

router.post('/create', categoryController.createCategory);
router.get('/getCategories', categoryController.getAllCategories);

module.exports = router;