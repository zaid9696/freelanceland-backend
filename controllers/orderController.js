const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const Order  = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');

exports.updateOrder = catchAsync(async (req, res, next) => {

		const {orderId} = req.params;
		const {accepted, notAccepted, completed, cancelled, delivered} = req.body;
		const updatedOrderClient = {
			accepted,
			notAccepted,
			completed,
			timeStampBuyer: new Date(Date.now())

		}

		const updatedOrderSeller = {
			cancelled,
			delivered,
			timeStampSeller: new Date(Date.now())
		}

		const isOrder = await Order.findById(orderId);
		let order 
		if(isOrder.user.toString() === req.user.id){
		
			 order = await Order.findByIdAndUpdate(orderId, updatedOrderClient, {
				new: true
			});
		}else if(isOrder.seller.toString() === req.user.id) {

			
			order = await Order.findByIdAndUpdate(orderId, updatedOrderSeller, {
				new: true
			});
		}

		
		res.status(200).json({
			status: 'success',
			order
		})
})

exports.getAllOrders = catchAsync(async (req, res, next) => {

	const orders = await Order.find();

	res.status(200).json({
		status: 'success',
		orders
	});

})

exports.getOneOrder = catchAsync(async (req, res, next) => {


		const {orderId} = req.params;
		

		const order = await Order.findOne({
			   $and: [
			      { orderId: { $in: orderId } },
			      {$or: [{user: req.user.id}, {seller: req.user.id}]}
			   ]
			}).populate({path: 'bundle'});

		if(!order){

		  return next(new AppError('The user is not authorized to access the page',401))
		}

		res.status(200).json({
			status: 'success',
			order,

		});
}) 

exports.createOrder = catchAsync(async (req, res, next) => {

	const {active, cancelled, completed, orderId, bundle, user, deliverDate, seller} = req.body;

	// const deliverDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
	// console.log(user);
	const newOrder = await Order.create({
		active,
		cancelled,
		completed,
		orderId,
		deliverDate,
		bundle,
		user,
		seller
	});

	res.status(201).json({
		status: 'success',
		newOrder
	})
});


