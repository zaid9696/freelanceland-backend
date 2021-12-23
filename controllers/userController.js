const User = require('../models/userModel');
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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {

	if(!req.file) return next();
	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({
		quality: 90
	}).toFile(`public/images/users/${req.file.filename}`)

	next()

})

exports.updateUser = catchAsync(async (req, res, next) => {

	const {email} = req.body

	const updatedUserObj = {
		email
	}

	if(req.file) updatedUserObj.photo = req.file.filename;

	const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedUserObj, {
		new: true
	});

	res.status(200).json({
		status: 'success',
		updatedUser
	})

})

exports.getUsers = catchAsync(async (req, res, next) => {

	const allUsers = await User.find();


	res.status(200).json({
		status: 'success',
		allUsers
	})

})