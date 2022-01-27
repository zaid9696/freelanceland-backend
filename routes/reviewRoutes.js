const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');


const router = express.Router();
router.route('/dashboard').get(authController.protect, reviewController.myReviews);
router.route('/:reviewId').patch(authController.protect, reviewController.updateReview);
router.route('/').post(authController.protect, reviewController.createReview).get(authController.protect, reviewController.getReviews);


module.exports = router;