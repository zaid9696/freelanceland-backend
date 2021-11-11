const Bundle =  require('../models/bundleModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');



// exports.bundleOrderSave = catchAsync(async (req, res, next) => {

// 	const {bundleId} = req.params;
	
// 	const {orders} = req.body;
// 	console.log(orders);
// 	const bundle = await Bundle.findById(bundleId);
// 	console.log(bundle.orders);

// 	 const newBundle  = await bundle.save()

// 	res.status(200).json({

// 		status: 'success',
// 		bundle
// 	})

// })

exports.getOneBundle = catchAsync(async (req, res, next) => {

	const {bundleId} = req.params;
	
	
	const bundle = await Bundle.findById(bundleId).populate({path: 'user'});

	res.status(200).json({

		status: 'success',
		bundle
	})

})

exports.getBundles = catchAsync(async (req, res, next) => {

	const bundles = await Bundle.find();

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