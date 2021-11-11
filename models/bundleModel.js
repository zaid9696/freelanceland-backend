const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt  = require('bcryptjs');
const slugify = require('slugify'); 

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
	orders: Array,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}

},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}

);

bundleSchema.pre('save', function(next) {

	this.slug = slugify(this.title, {lower: true});

	next()
})


const Bundle = mongoose.model('Bundle', bundleSchema);

module.exports = Bundle;
