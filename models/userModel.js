const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt  = require('bcryptjs');

const userSchema = new mongoose.Schema({

	userName: {
		type: String,
		unique: true,
		trim: true,
		required: [true, 'Please enter user name']
	},
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		lowerCase: true,
		required: [true, 'Please provide us an email'],
		validate: [validator.isEmail, 'Please provide a valid email']
	},
	role: {
		type: String,
		required: [true, 'Please choice the account type'],
		enum: {
			values: ['freelancer', 'client'],
			message: `This value {VALUE} is not accepted. Please choice freelancer or client`
		},
	},
	photo: {
		type: String,
		default: 'user.jpg'
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minLength: 4,
		select: false
	},
	userRatingAverage: {
		type: Number,
		min: [1, 'User Average must be above 1.0'],
		max: [5, 'User Average must be blow 5.0']
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
	userTotalReviews: {
		type: Number,
		default: 0
	},
	totalEarned: {
		type: Number,
		default: 0
	},
	skills: [String],
	languages:[String],
	favourites: [String],
	aboutMe: String,
	lastSeen: Date,
	countryCode: String,
	localTimeZone: String,
	completedOrders: {
		type: Number,
		default:0
	},
	isFacebook: {
		type: Boolean,
		default: false
	},
	recentDelivery: Date
	
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
}
);



userSchema.index({userName: 1});

// Removing White Spaces From UserName;
userSchema.pre('save', async function(next) {

	this.userName = await this.userName.replace(/ /g, "");

	next();
});


userSchema.pre('save', async function(next){

	if(!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	next();

});

userSchema.methods.correctPassword = async (possiblePassword, password) => {

	return await bcrypt.compare(possiblePassword, password);
}



const User = mongoose.model('User', userSchema);




module.exports = User;