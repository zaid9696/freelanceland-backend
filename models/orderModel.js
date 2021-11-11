const mongoose = require('mongoose');




const orderSchema = new mongoose.Schema({

	createdAt: {
		type: Date,
		default: Date.now()
	},

	active: {
		type: Boolean,
		default: false
	},
	cancelled: {
		type: Boolean,
		default: false
	},
	completed: {
		type: Boolean,
		default: false
	},
	delivered: {
		type: Boolean,
		default: false
	},
	accepted: {
		type: Boolean,
		default: false
	},
	notAccepted: {
		type: Boolean,
		default: false
	},
	timeStampSeller: Date,
	timeStampBuyer: Date,
	orderId: {
		type: String,
		required: [true, 'Order ID is required']
	},
	deliverDate: Date,
	bundle: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bundle'
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	seller: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}	

);




const Order = mongoose.model('Order', orderSchema);

module.exports = Order;



