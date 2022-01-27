const User = require('../models/userModel');
const Bundle = require('../models/bundleModel');
const Review =  require('../models/reviewModal');
const Order  =  require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {

	if(!req.file) return next();
	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({
		quality: 90
	}).toFile(`public/images/users/${req.file.filename}`)

	next()

})

exports.getDashboardFavourites = catchAsync(async (req, res, next) => {

	const allFav =  await User.findById(req.user.id).populate({path: 'favourites'})



	// await Promise.all()

	let favBundles = []

	await Promise.all(allFav.favourites.map(async (item) => {

		const result = await Bundle.findById(item).populate({path: 'user category'});;

		favBundles.push(result);

	}));




	console.log({favBundles});


	res.status(200).json({
		status: 'success',
		favBundles
	})
})

exports.getDashboardUser = catchAsync(async (req, res, next) => {

	const user = await User.findById(req.user.id);

	const orders = await Order.find({
		seller: req.user.id
	});

	console.log({orders});
	let activeNum = 0;
	let cancelNum = 0;
	let completedNum = 0;

	orders.map(item => {

		if(item.active){

			activeNum += 1;
		}

		if(item.accepted && item.delivered){
			completedNum += 1;
		}
		if(item.cancelled){
			cancelNum += 1;
		}


	});

	// console.log({activeNum, completedNum});

	res.status(200).json({
		status: 'success',
		user,
		cancelNum,
		completedNum,
		activeNum
	})
})

exports.removeFavourites = catchAsync(async (req, res, next) => {

	const {userId} = req.params;
	const {bundleId} = req.body;
	const removedFavourites  = await User.findByIdAndUpdate(userId, {
		$pull: {favourites: bundleId}
	});
	console.log({userId, bundleId});

	res.status(200).json({
		status: 'success',
		removedFavourites
	})

})

exports.addFavourite = catchAsync(async (req, res, next) => {

	const {userId} = req.params;
	const {bundleId} = req.body;
	const updatedFavourites  = await User.findByIdAndUpdate(userId, {
		$addToSet: {favourites: bundleId}
	});
	console.log({userId, bundleId});

	res.status(200).json({
		status: 'success',
		updatedFavourites
	})
})

exports.updateUser = catchAsync(async (req, res, next) => {

	const {aboutMe, skills, firstName, lastName, localTimeZone, countryCode, additionalLang, preferredLang, phone} = req.body

	let arrSkills = []
	const testSkill = skills.split(',').map(item => {

		arrSkills.push(item);
	})
	const updatedUserObj = {
		aboutMe,
		skills: arrSkills,
		firstName,
		lastName,
		localTimeZone,
		countryCode,
		additionalLang,
		preferredLang,
		phone
	}

	if(req.file) updatedUserObj.photo = req.file.filename;

	const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedUserObj, {
		new: true
	});


	console.log({arrSkills});

	res.status(200).json({
		status: 'success',
		updatedUser: updatedUserObj
	})

})

exports.getOneUser = catchAsync(async (req, res, next) => {

	const {userName} = req.params;

	const user = await User.findOne({
		userName: userName
	});

	const bundles = await Bundle.find({
		user: user.id
	}).populate('user category', 'photo userName category categorySlug id');

	const reviews = await Review.find({$or: [{seller: user.id}, {buyer: user.id}]}).populate('creator buyer seller', 'userName photo').populate({
		path: 'reply',
		populate: {path: 'creator'}
	});


	res.status(200).json({
		status: 'success',
		user,
		bundles,
		reviews
	})

})