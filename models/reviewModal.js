const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

	review: {
		type: String,
		required: [true, 'Review Can not be empty']
	},
	rating: {
		type: Number,
		min: 1,
		max:5
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	bundle: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bundle'
	},
	buyer: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	seller: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	reply: {
		type: mongoose.Schema.ObjectId,
		ref: 'Review'
	}
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;