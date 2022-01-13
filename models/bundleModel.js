const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt  = require('bcryptjs');
const slugify = require('slugify');
// const Review = = require('reviewModal');

const bundleSchema = new mongoose.Schema({

	title: {
		type: String,
		required: [true, ' title is required']
	},
	slug: String,
	price: {
		type: Number,
		required: [true, ' Price is required']
	},
	deliverDays:{
		type: Number,
		required: [true, ' Delivery Day is required']
	},
	revisions: {
		type: Number,
		required: [true, ' Revision is required']
	},
	description: {
		type: String,
		required: [true, ' Description is required']
	}, 
	images: [String],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	category: {
		type: mongoose.Schema.ObjectId,
		ref: 'Category',
		required: [true, 'Bundle must have a category']
	},
	ratingsAverage: {
		type: Number,
		min: [1, 'A bundle must be above 1.0'],
		max: [5, 'A bundle must be below 5.0'],
		set: value => Math.round(value * 10) / 10
	},
	ratingsQuantity: {
		type:Number,
		default:0
	},
	createdAt: Date

},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}

);

bundleSchema.index({
	title: 'text'
})

bundleSchema.pre('save', function(next) {

	this.slug = slugify(this.title, {lower: true});

	next()
})



const Bundle = mongoose.model('Bundle', bundleSchema);

module.exports = Bundle;
