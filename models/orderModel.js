const mongoose = require('mongoose');
const User = require('./userModel');

const orderSchema = new mongoose.Schema({

	createdAt: {
		type: Date,
		default: Date.now()
	},

	buyerReview: {
		type: mongoose.Schema.ObjectId,
		ref: 'Review'
	},
	sellerReview: {
			type: mongoose.Schema.ObjectId,
			ref: 'Review'
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
	deliveredDesc: String,
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
		required: [true, 'Order ID is REQUIRED']
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
	},

},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}	

);

orderSchema.statics.calcOrders = async function(sellerId){

	const statsTotalComplatedOrders = await this.aggregate([

			{
				$match: {seller: sellerId, accepted: true}
			},
			{
				$group: {
					_id: '$seller',
					totalOrdersComplated: {$sum: 1},
				}
			}

		]);

	const statsTotalNotComplatedOrders = await this.aggregate([

			{
				$match: {seller: sellerId, }
			},
			{
				$group: {
					_id: '$seller',
					totalOrdersNoComplated: {$sum: 1},
				}
			}

		]);

	const recentDelivery = await this.aggregate([

			{
				$match: {seller: sellerId, delivered: true}	
			},

			{
				$group: {
					_id: '$timeStampSeller',
					lastDelivery: {$first: '$timeStampSeller'}
				},
			},
			{
				$sort: {lastDelivery: -1}
			},
			{
				$limit:1
			}

	]);

	
	
	const totalOrders = statsTotalNotComplatedOrders[0].totalOrdersNoComplated ? statsTotalNotComplatedOrders[0].totalOrdersNoComplated : 0
	const completed = statsTotalComplatedOrders.length !== 0 ? statsTotalComplatedOrders[0].totalOrdersComplated : 0;
	const totalPercentage = (100 * completed) / totalOrders;

	if(statsTotalNotComplatedOrders.length > 0){
		await User.findByIdAndUpdate(sellerId, {completedOrders: totalPercentage} );
	}

	if(recentDelivery.length > 0){

		await User.findByIdAndUpdate(sellerId, {
			recentDelivery: recentDelivery[0].lastDelivery
		})
	}

	

}

orderSchema.pre(/^findOneAnd/, async function(next){

	
	this.r = await this.findOne().clone();
	next()
});

orderSchema.post(/^findOneAnd/, async function(){
	
	await this.r.constructor.calcOrders(this.r.seller);
});






const Order = mongoose.model('Order', orderSchema);

module.exports = Order;



