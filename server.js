const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app.js');

const db = process.env.DATABASE;

mongoose.connect(db).then(con => console.log('MongoDB Connection Successfully'))

const port = process.env.HOST_PORT || 5000;

const server =  app.listen(port, (req, res) => {

	console.log(`App running on port ${port}`);
})

const io = require('socket.io')(server);

// console.log(io);

io.on('connection', () =>{
  console.log('a user is connected')
})

app.set('socketio', io);
