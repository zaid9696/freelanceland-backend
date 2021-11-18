const Message = require('../models/messageModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');





exports.postMessage = catchAsync(async (req, res, next) => {

		const newMessage = await Message.create(req.body);
	
		const io = req.app.get('socketio');

		io.emit('message', req.body);
		
		res.status(201).json({
			status: 'success',
			newMessage
		})

})

exports.getMessage = catchAsync(async (req, res, next) => {


		const message = await Message.find();
		
		res.status(200).json({
			status: 'success',
			message
		})

		

})