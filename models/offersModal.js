const mongoose = require('mongoose');


const offersSchema = new  mongoose.Schema({

	buyer: {
		type:  mongoose.Schema.ObjectId,
		ref: 'User'
	},
	request: String,
	category: {
		type: mongoose.Schema.ObjectId,
		ref: 'Category'
	},
	delivery: Number,
	createdAt: Date,
	expiry: Date,
	firstBudget: Number,
	secondBudget: Number
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}

);


const Offers =  mongoose.model('Offers', offersSchema);

module.exports = Offers;