const jtw = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');


const signInToken = (id) => {

	return jtw.sign({id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
}

const createToken = (user, statusCode, req, res) => {

	const token = signInToken(user._id);
	const dateNow = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000);
	console.log('Date', dateNow);
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
		httpOnly: true
	}

	res.cookie('jwt', token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {data: user}
	})
	

}


exports.signUp = catchAsync(async (req, res, next) => {

	const {userName, email, password, firstName, lastName, skills, aboutMe} = req.body;

	// console.log(firstName)
	const newUser = await User.create({
		userName,
		email,
		firstName,
		lastName,
		skills,
		aboutMe,
		password
	});

	createToken(newUser, 201, req, res);



})