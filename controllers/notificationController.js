const Notification = require('../models/notificationModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.updateNotification = catchAsync(async (req, res, next) => {

	const {notificationId} = req.params;

	const updateNotification = await Notification.findByIdAndUpdate(notificationId, {
		read: true
	}, {
		new: true
	});

	res.status(200).json({
		status: 'success',
		updateNotification
	})


});

exports.getAllNotifications = catchAsync(async (req, res, next) => {

		let limit = req.query.limit * 1;
		limit > 0 ? limit = req.query.limit * 1 : limit = 0; 
		const notifications = await Notification.find({
			$or: [{sender: req.user.id}, {receiver: req.user.id}]
		}).limit(limit).sort({createdAt: -1});
		

		res.status(200).json({
			status: 'success',
			notifications
		})

})


exports.createNotification = catchAsync(async (req, res, next) => {

	const {orderId, status, buyer, title, sender, receiver, creator} = req.body;

	const newNotification = await Notification.create({
		orderId,
		status,
		buyer,
		title,
		sender,
		receiver,
		creator,
		createdAt: Date.now()
	})

	// const newNotification = await newNoti.populate('order');

	res.status(201).json({
		status: 'success',
		newNotification
	})
})



