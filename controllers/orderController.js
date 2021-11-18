const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const Order  = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');

exports.updateOrder = catchAsync(async (req, res, next) => {

		const {orderId} = req.params;
		const {accepted, notAccepted, completed, cancelled, delivered, deliveredDesc, active} = req.body;
		const updatedOrderClient = {
			accepted,
			notAccepted,
			completed,
			active,
			timeStampBuyer: new Date(Date.now())

		}

		const updatedOrderSeller = {
			cancelled,
			delivered,
			deliveredDesc,
			active,
			notAccepted,
			timeStampBuyer: notAccepted ? new Date(Date.now()) : undefined,
			timeStampSeller: !notAccepted ? new Date(Date.now()) : undefined
		}

		const isOrder = await Order.findById(orderId);
		let order ;
		let isUser;
		if(isOrder.user.toString() === req.user.id){
		
			 order = await Order.findByIdAndUpdate(orderId, updatedOrderClient, {
				new: true
			});
			isUser = true;
		}else if(isOrder.seller.toString() === req.user.id) {

			
			if(!deliveredDesc && !cancelled && !notAccepted){

				return next(new AppError('You must provide a MESSAGE for the Buyer'));
			}

			order = await Order.findByIdAndUpdate(orderId, updatedOrderSeller, {
				new: true
			});
			isUser = false
		}

		
		res.status(200).json({
			status: 'success',
			order,
			isUser: isUser
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

		const {deliverDate} = order;

		const newDate = new Date(Date.now());
		const endDate = new Date(deliverDate);
		const timeRemaining = endDate.getTime() - newDate.getTime();

		// let expiredTime = false;
		// if(timeRemaining < 0){
		// 	expiredTime = true;
		// }

		let isUser;

		if (order.user.toString() === req.user.id) {

			isUser = true;
		}else {

			isUser = false;
		}

		if(!order){

		  return next(new AppError('The user is not authorized to access the page',401))
		}

		res.status(200).json({
			status: 'success',
			order,
			isUser,
			// expiredTime
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


