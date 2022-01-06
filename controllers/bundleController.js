const Bundle =  require('../models/bundleModel');
const Review =  require('../models/reviewModal');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');

exports.getBundlesByLatest = catchAsync(async (req, res, next) => {

	const latestBundles =  await Bundle.find().limit(4).sort({
		createdAt: -1
	}).populate('user', 'userName photo');

	res.status(200).json({
		status: 'success',
		latestBundles
	})

})

exports.getBundlesByTopRate = catchAsync(async (req, res, next) => {


	const topRatedBundles = await Bundle.find().limit(4).sort({
		ratingsAverage: -1,
		ratingsQuantity: -1
	}).populate('user', 'userName photo');

	res.status(200).json({
		status: 'success',
		topRatedBundles
	})

})



exports.getOneBundle = catchAsync(async (req, res, next) => {

	const {bundleId} = req.params;
	
	
	const bundle = await Bundle.findById(bundleId).populate({path: 'user'});
	let reviews = await Review.find({
		bundle: bundle.id,
		isReviewer: true
	}).populate({path: 'buyer reply seller'});

	res.status(200).json({

		status: 'success',
		bundle,
		reviews
	})

})

exports.getBundles = catchAsync(async (req, res, next) => {

	const {userId, bundleId} = req.params;
	const bundles = await Bundle.find({user: userId, _id: {$ne: bundleId}}).populate({path: 'user'});

	res.status(200).json({
		status:'success',
		bundles:bundles
	})

});

exports.addBundle = catchAsync(async (req, res, next) => {

	const {title, price, revisions, deliverDays, description, images, orders, user} = req.body;

	// console.log({
	// 	title,
	// 	price,
	// 	revisions,
	// 	deliverDays,
	// 	description,
	// 	images,
	// 	orders,
	// 	user
	// })

	const newBundle = await Bundle.create({
		title,
		price,
		revisions,
		deliverDays,
		description,
		images,
		orders,
		user
	});

	res.status(201).json({
		status: 'success',
		bundle:newBundle
	})

})