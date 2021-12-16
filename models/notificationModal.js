const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({

	orderId:String,
	status: String,
	title: String,
	buyer: String,
	sender: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	receiver: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	creator: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	createdAt: Date,
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

// notificationSchema.pre(/^find/, async function(next){

// 	this.populate({path: 'order', select: 'seller user orderId'});
// 	next();
// })

const Notification = mongoose.model('Notification', notificationSchema);


module.exports = Notification;