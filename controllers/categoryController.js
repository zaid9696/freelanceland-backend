const Category = require('../models/categoryModal');
const Bundle =   require('../models/bundleModel');
const catchAsync =  require('../utils/catchAsync.js');
const AppError = require('../utils/AppError');



exports.getAllbundlesByCategory = catchAsync(async (req, res, next) => {


		const {category} = req.params;
		const {page, price, review} = req.query;
		const pageNum = page * 1;
		const limitNum =  3;
		const categoryId = await Category.findOne({categorySlug: category});
		let totalBundlesNum = await Bundle.find({
			category: categoryId.id
		}).countDocuments();
		let count = totalBundlesNum / limitNum; 
		count = Math.ceil(count);	

		let filterBundle = {};
		if(price !== 'undefined'){
		
			price == 'low-high' ? filterBundle = {price: 1} : filterBundle = {price: -1};
		}

		if(review !== 'undefined'){
			review == 'low-high' ? filterBundle = {ratingsAverage: 1} : filterBundle = {ratingsAverage: -1}
		}

		console.log({filterBundle,review});
		const skip = (pageNum - 1) * limitNum;
		let bundles = await Bundle.find({
			category: categoryId.id
		}).skip(skip).limit(limitNum).sort(filterBundle).populate('user', 'userName photo')


		console.log({count, page, skip, price});

		res.status(200).json({
			status:  'success',
			category: categoryId,
			bundles,
			count,
			totalBundlesNum
		});


})

exports.getAllCategories =  catchAsync(async (req, res, next) => {

	const allCategories = await Category.find(); 

	res.status(200).json({
		status: 'success',
		allCategories
	})
})

exports.createCategory = catchAsync(async (req, res, next) => {

	const {category} =  req.body;
	const newCategroy = await Category.create({
		category
	})
	res.status(201).json({
		status:  'success',
		newCategroy
	})
})




