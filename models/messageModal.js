const mongoose = require('mongoose');




const messageSchema = new mongoose.Schema({

	sender: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	receiver: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	timeStamp: {
		type: Date,
		default: Date.now()
	},
	message: {
		type: String,
		required: [true, 'A message is required']
	},
	read: {
		type: Boolean,
		default: false
	}
},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}

);


const Message = mongoose.model('Message', messageSchema);


module.exports = Message;