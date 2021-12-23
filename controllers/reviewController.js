const Review = require('../models/reviewModal');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');

exports.getReviews = catchAsync(async (req, res, next) => {

	const allReviews = await Review.find().populate('reply');

	res.status(200).json({
		status: 'success',
		allReviews
	})

})

exports.updateReview = catchAsync(async (req, res, next) => {

		const {reviewId} = req.params;
		const {reply} = req.body;
		const review = await Review.findByIdAndUpdate(reviewId, {
			reply
		},{new: true});


		res.status(200).json({
			status: 'success',
			review
		});

})

exports.createReview = catchAsync(async (req, res, next) => {

	const {review, rating, buyer, bundle, seller, createdAt} = req.body;

		const newReview = await Review.create({
			review,
			rating,
			buyer,
			bundle,
			seller,
			createdAt
		});


	res.status(201).json({
		status: 'success',
		newReview
	})

})