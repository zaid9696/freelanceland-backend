const Bundle =  require('../models/bundleModel');
const Review =  require('../models/reviewModal');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {

	if(file.mimetype.startsWith('image')){
		cb(null, true)
	}else {
		cb(new AppError('Please Upload Only Image', 400))
	}

}

const upload = multer({

	storage: multerStorage,
	fileFilter: multerFilter
});

exports.uploadBundleImages = upload.fields([

	{name: 'images', maxCount: 2}

]);

exports.resizeBundleImages = catchAsync (async (req, res, next) => {

	if(!req.files.images) return next(new AppError('You can not create a bundle without images so, Please upload images',401));

	
	req.body.image = []

	await Promise.all(req.files.images.map(async (file, i) => {

		const imageName = `bundle-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;
		await sharp(file.buffer).resize(2000,1333).toFormat('jpeg').jpeg({
			quality: 90
		}).toFile(`public/images/bundles/${imageName}`);
		req.body.image.push(imageName);

	}));

	next();
})


exports.searchBundles = catchAsync(async (req, res, next) => {

		const {query} = req.params;
	
		const searchedBundles = await Bundle.find({
			    '$text': {
			        '$search': query
			    },
			})
		


	res.status(200).json({
		status: 'success',
		searchedBundles
	})


})

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
	
	
	const bundle = await Bundle.findById(bundleId).populate({path: 'user category'});
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
	const bundles = await Bundle.find({user: userId, _id: {$ne: bundleId}}).populate({path: 'user category'});

	res.status(200).json({
		status:'success',
		bundles:bundles
	})

});

exports.addBundle = catchAsync(async (req, res, next) => {

	const {title, price, revisions, deliverDays, description, images, user, category} = req.body;

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
		images: req.body.image,
		user,
		category,
		createdAt: Date.now()
	});

	// const newBundle = {
	// 	title,
	// 	price,
	// 	revisions,
	// 	deliverDays,
	// 	description,
	// 	images: req.body.image,
	// 	user,
	// 	category,
	// 	createdAt: Date.now()
	// }

	console.log({images: req.body.image});
	res.status(201).json({
		status: 'success',
		bundle:newBundle
	})

})