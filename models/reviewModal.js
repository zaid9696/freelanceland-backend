const mongoose = require('mongoose');
const Bundle = require('./bundleModel');
const User = require('./userModel');

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
	creator:{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	reply: {
		type: mongoose.Schema.ObjectId,
		ref: 'Review'
	},
	isReviewer: {
		type: Boolean,
		default: false
	}
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
});

reviewSchema.statics.calcBundlesReviews = async function(bundleId, sellerId){


	const stats = await this.aggregate([

			{
				$match: {bundle: bundleId, creator: {$ne: sellerId}}
			},
			{
				$group: {
					_id: '$bundle',
					reviewCount: {$sum: 1},
					bundleAveRatings: {$avg: '$rating'}
				}
			}
		]);

	if(stats.length > 0){

		await Bundle.findByIdAndUpdate(bundleId, {
			ratingsAverage: stats[0].bundleAveRatings,
			ratingsQuantity: stats[0].reviewCount
		})
	}else {

		await Bundle.findByIdAndUpdate(bundleId, {
			ratingsAverage: 4.5,
			ratingsQuantity: 0
		})

	}


	


}



reviewSchema.statics.calcUserReviews = async function(userId, creatorId) {

	const stats = await this.aggregate([

				{
				  $match:{$or: [{seller: userId}, {buyer: userId}], creator: {$ne: userId}}
				},
				{
					$group: {
						_id: {
							'seller': '$seller',
							'buyer': '$buyer'
						},
						userReviewCount: {$sum: 1},
						avgUserRatings: {$avg: '$rating'}
					},
					$group: {
						_id: {
							totalCounts: '$userReviewCount',
							totalAvgs: '$avgUserRatings'
						},
						totalReviews: {$sum:1},
						totalAverage: {$avg: '$rating'}
					}
				}

		]);

	if(stats.length > 0){

		await User.findByIdAndUpdate(userId, {
			userRatingAverage: stats[0].totalAverage,
			userTotalReviews: stats[0].totalReviews
		});

		
	}


}

reviewSchema.post('save', function() {

	if(this.isReviewer){
		
		this.constructor.calcBundlesReviews(this.bundle, this.seller);
		this.constructor.calcUserReviews(this.seller, this.creator);
	}else {

		this.constructor.calcUserReviews(this.buyer, this.creator);

	}



})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;