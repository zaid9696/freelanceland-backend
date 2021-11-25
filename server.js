const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app.js');
const Message = require('./models/messageModal');
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


app.set('socketio', io);
io.on('connection', (socket) =>{

	 socket.on('updatedMessage', async (messIds) => {
	 			console.log('from backend ' + messIds);
	 		const updatedMessages = await Message.updateMany(
	 		{
	 			_id: {$in: messIds },
	 			read: false
	 		}, 
	 		
	 		{
	 			$set: {message: 'test9'}
	 		},
	 	
	 		);


	 		const newMessages = await Message.find({
	 			_id: {$in: messIds}
	 		}).populate('sender receiver', 'userName');;



	 		// const newMessage = await Message.find();
	 		console.log('from updated Messages ' + updatedMessages);
	 		io.sockets.emit('updatedMessage', newMessages);

	 })	

	  // / messageController.postMessage(socket);
	 socket.on('message', async ({message, sender, receiver, isTyping}) => {

	 	console.log(isTyping);

	 	if(!isTyping && message){

	 	let newMessage;
	 	const createdMessage =  await Message.create({message, sender, receiver, timeStamp: new Date(Date.now())});
	 	newMessage = await createdMessage.populate('sender receiver', 'userName');
	 	newMessage.isTyping = false;
	 	io.sockets.emit('message', newMessage);
	 	// const newMessage = await doc.save();
	 	console.log(newMessage + ' from Server.js');

	 	}else {

	 		io.sockets.emit('message', {isTyping, sender});
	 	}


	 });
	 // socket.emit('message', 'test e')
  console.log('a user is connected')
})


httpServer.listen(port, (req, res) => {

	console.log(`App running on port ${port}`);
})


