const Offers =  require('../models/offersModal');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');

exports.getAllOtherOffers  = catchAsync(async (req, res, next) => {

	const allOffers =  await Offers.find({buyer: {$ne: req.user.id}}).populate('buyer category', 'photo userName category categorySlug').sort({createdAt: -1})


	res.status(200).json({
		status: 'success',
		allOffers
	})



})

exports.getAllMyOffers =  catchAsync(async (req, res, next) => {

	const allRequests = await Offers.find({buyer: req.user.id}).populate('buyer category', 'photo userName category categorySlug').sort({createdAt: -1});

	res.status(200).json({
		status: 'success',
		allRequests
	})
})

exports.getAllOffers = catchAsync(async (req, res, next) => {

	const allOffers = await Offers.find().populate('buyer category', 'photo userName category categorySlug').sort({createdAt: -1});

	res.status(200).json({
		status: 'success',
		allOffers
	})

})

exports.createOffer = catchAsync(async (req, res, next) => {

	const {buyer, request, delivery, firstBudget, secondBudget, expiry, category} =  req.body;
	const expiryDate = new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);

	const newOffer = await Offers.create({
		buyer,
		request,
		delivery,
		firstBudget,
		secondBudget,
		expiry: expiryDate,
		category,
		createdAt: Date.now()
	})

	res.status(201).json({
		status: 'success',
		newOffer
	})

})


