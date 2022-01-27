const Message = require('../models/messageModal');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterMessages = require('../utils/filterMessages');


exports.usersMessages = catchAsync(async (req, res, next) => {

	// const {userId} = req.params;
	const userId = req.user.id;
	let limit = req.query.limit * 1
	limit > 0 ? limit = req.query.limit * 1 : limit = 0;


	const allMessages = await Message.find({
			
			$or: [{sender: userId}, {receiver: userId}]
			
		}).sort({timeStamp: -1}).populate('sender receiver', 'userName photo');

	// console.log({allMessages});
   	const usersMessages = filterMessages(allMessages, req.user, limit);

   		res.status(200).json({
			status: 'success',
			usersMessages
		});

})

exports.getMessageByUserName = catchAsync(async (req, res, next) => {

		const {userName} = req.params;
		const user = await User.findOne({userName})
		
		if(userName == req.user.userName){

			return next(new AppError('You can not send messages to yourself, I mean what the heck', 401))
		}

		const messages = await Message.find({
			$and: [
				{$or: [{sender: user.id}, {receiver: user.id}]},
				{$or: [{sender: req.user.id}, {receiver: req.user.id}]}
			]
		}).populate('sender receiver', 'userName photo');

		const allMessages = await Message.find({
			
			$or: [{sender: req.user.id}, {receiver: req.user.id}]
			
		}).sort({timeStamp: -1}).populate('sender receiver', 'userName photo');;


   		const usersMessages = filterMessages(allMessages, req.user);

		
		res.status(200).json({
			status: 'success',
			messages,
			allMessages,
			usersMessages,
			user
		});

})

