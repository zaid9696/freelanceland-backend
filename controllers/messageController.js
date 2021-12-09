const Message = require('../models/messageModal');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterMessages = require('../utils/filterMessages');

// [
//     {
//         "_id": "61a2bec54c69b950136c590a",
//         "sender": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "receiver": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "timeStamp": "2021-11-27T23:27:01.181Z",
//         "message": "ready",
//         "read": true,
//         "__v": 0,
//         "id": "61a2bec54c69b950136c590a"
//     },
//     {
//         "_id": "61a2bed54c69b950136c5912",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "timeStamp": "2021-11-27T23:27:17.176Z",
//         "message": "Yes",
//         "read": true,
//         "__v": 0,
//         "id": "61a2bed54c69b950136c5912"
//     },
//     {
//         "_id": "61a2ce7ffaa78ab5d3f5b6e9",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "timeStamp": "2021-11-28T00:34:07.090Z",
//         "message": "kk",
//         "read": true,
//         "__v": 0,
//         "id": "61a2ce7ffaa78ab5d3f5b6e9"
//     },
//     {
//         "_id": "61a4baac5043524c77258eff",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "timeStamp": "2021-11-29T11:34:04.502Z",
//         "message": "kk",
//         "read": true,
//         "__v": 0,
//         "id": "61a4baac5043524c77258eff"
//     },
//     {
//         "_id": "61a4bc1d1bcf70adc765fc51",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "timeStamp": "2021-11-29T11:40:13.937Z",
//         "message": "444",
//         "read": true,
//         "__v": 0,
//         "id": "61a4bc1d1bcf70adc765fc51"
//     },
//     {
//         "_id": "61a4e7f768ed7ce5498b99f4",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "618ba21e6ca7fef1d78298ef",
//             "userName": "Zaidtest",
//             "id": "618ba21e6ca7fef1d78298ef"
//         },
//         "timeStamp": "2021-11-29T14:47:19.081Z",
//         "message": "are you",
//         "read": true,
//         "__v": 0,
//         "id": "61a4e7f768ed7ce5498b99f4"
//     },
//     {
//         "_id": "61a6c6012a5d1db6519bba63",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "61a6be9e6460b5ad310f7776",
//             "userName": "zaidUSA",
//             "id": "61a6be9e6460b5ad310f7776"
//         },
//         "timeStamp": "2021-12-01T00:46:57.420Z",
//         "message": "wowo",
//         "read": false,
//         "__v": 0,
//         "id": "61a6c6012a5d1db6519bba63"
//     },
//     {
//         "_id": "61a76d1b1a8aced8e637c6f2",
//         "sender": {
//             "_id": "61774aff67dac72597a4b170",
//             "userName": "ZaidAhmed",
//             "id": "61774aff67dac72597a4b170"
//         },
//         "receiver": {
//             "_id": "61a6be9e6460b5ad310f7776",
//             "userName": "zaidUSA",
//             "id": "61a6be9e6460b5ad310f7776"
//         },
//         "timeStamp": "2021-12-01T12:39:55.870Z",
//         "message": "ll",
//         "read": false,
//         "__v": 0,
//         "id": "61a76d1b1a8aced8e637c6f2"
//     }
// ]

// "61a6be9e6460b5ad310f7776"

exports.usersMessages = catchAsync(async (req, res, next) => {

	const {userId} = req.params;

	const allMessages = await Message.find({
			
			$or: [{sender: userId}, {receiver: userId}]
			
		}).sort({timeStamp: -1}).populate('sender receiver', 'userName');;

	// console.log({allMessages});
   	const usersMessages = filterMessages(allMessages, req.user);

   		res.status(200).json({
			status: 'success',
			usersMessages
		});

})

exports.getMessageByUserName = catchAsync(async (req, res, next) => {

		const {userName} = req.params;
		const user = await User.findOne({userName});
		
		if(userName == req.user.userName){

			return next(new AppError('You can not send messages to yourself, I mean what the heck', 401))
		}

		const messages = await Message.find({
			$and: [
				{$or: [{sender: user.id}, {receiver: user.id}]},
				{$or: [{sender: req.user.id}, {receiver: req.user.id}]}
			]
		}).populate('sender receiver', 'userName');

		const allMessages = await Message.find({
			
			$or: [{sender: req.user.id}, {receiver: req.user.id}]
			
		}).sort({timeStamp: -1}).populate('sender receiver', 'userName');;


   		const usersMessages = filterMessages(allMessages, req.user);

		
		res.status(200).json({
			status: 'success',
			messages,
			allMessages,
			usersMessages,
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