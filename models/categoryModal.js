const mongoose = require('mongoose');
const slugify = require('slugify')

const categorySchema  =  new mongoose.Schema({

	category: {
		type: String
	},
	categorySlug: {
		type: String
	}
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}
);

categorySchema.pre('save', function(next) {

	this.categorySlug = slugify(this.category, {lower: true});
	next()

});

const Category =  mongoose.model('Category', categorySchema);

module.exports = Category;