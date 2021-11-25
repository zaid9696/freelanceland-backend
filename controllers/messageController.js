const Message = require('../models/messageModal');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');




exports.getMessageByUserName = catchAsync(async (req, res, next) => {

		const {userName} = req.params;
		const user = await User.findOne({userName}).select('userName');
		console.log(user);
		const messages = await Message.find({
			$and: [
				{$or: [{sender: user.id}, {receiver: user.id}]},
				{$or: [{sender: req.user.id}, {receiver: req.user.id}]}
			]
		}).populate('sender receiver', 'userName');

		
		res.status(200).json({
			status: 'success',
			messages,
			user
		});

})

// exports.getMessage = catchAsync(async (req, res, next) => {


// 		const message = await Message.find();
		
// 		res.status(200).json({
// 			status: 'success',
// 			message
// 		})

		

// })