const express = require('express');

const categoryController = require('../controllers/categoryController');



const router = express.Router();


router.route('/:category').get(categoryController.getAllbundlesByCategory);
router.route('/').post(categoryController.createCategory).get(categoryController.getAllCategories);



module.exports = router;