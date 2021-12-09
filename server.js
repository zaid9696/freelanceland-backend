const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app.js');
const Message = require('./models/messageModal');
const User = require('./models/userModel');
const filterMessages = require('./utils/filterMessages');
const httpServer = require("http").createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: process.env.URL_PATH,
    methods: ["GET", "POST"],
    credentials: true
  }
});


const db = process.env.DATABASE;

mongoose.connect(db).then(con => console.log('MongoDB Connection Successfully'))

const port = process.env.HOST_PORT || 5000;


const users = {};
io.sockets.on('connection', (socket) =>{


	 socket.on('updatedMessage', async (messIds) => {
	 			
	 		const updatedMessages = await Message.updateMany(
	 		{
	 			_id: {$in: messIds },
	 			read: false
	 		}, 
	 		
	 		{
	 			$set: {read: true}
	 		},
	 	
	 		);


	 		const newMessages = await Message.find({
	 			_id: {$in: messIds},
	 			read: true
	 		}).populate('sender receiver', 'userName');;



	 		// const newMessage = await Message.find();
	 		console.log('from updated Messages ' + updatedMessages);
	 		io.sockets.emit('updatedMessage', newMessages);

	 })	

	  // / messageController.postMessage(socket);
	 socket.on('message', async ({message, sender, receiver, isTyping, userName}) => {

	 	

	 	if(!isTyping && message){

	 	let newMessage;
	 	const createdMessage =  await Message.create({message, sender, receiver, timeStamp: new Date(Date.now())});
	 	newMessage = await createdMessage.populate('sender receiver', 'userName');
	 	const userInfo = {
	 		userName,
	 		id: sender
	 	}


	 	const allMessages = await Message.find({
			
			$or: [{sender: sender}, {receiver: sender}]
			
		}).sort({timeStamp: -1}).populate('sender receiver', 'userName');
	 	
	 	const usersMessages = await filterMessages(allMessages, userInfo);
	 	
	 	io.sockets.emit('usersMessages', newMessage);
	
	 	io.sockets.emit('message',  newMessage);
		 	// console.log(newMessage + ' from Server.js');

	 	}else {

	 			io.sockets.emit('message', {isTyping, sender, receiver});
	 	}


	 });


	socket.on('isOnline', async ({userId, isOnline}) => {

		users[socket.id] = userId;
		console.log(users[socket.id], userId);
		
		io.sockets.emit('isOnline', {users})
		
	})


	socket.on('disconnect', async () => {

	  		console.log('disconnect user ' + users[socket.id]);
	  		await User.findByIdAndUpdate(users[socket.id], {
									lastSeen:  Date.now()
						}, {new: true})
	  	const userId = users[socket.id];
	 		delete users[socket.id];
			io.sockets.emit('isOnline', {users, lastSeen: {date: Date.now(), userId}})

	  })

	 // socket.emit('message', 'test e')
  console.log('a user is connected')
})


httpServer.listen(port, (req, res) => {

	console.log(`App running on port ${port}`);
})


