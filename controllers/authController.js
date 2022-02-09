const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');


const signInToken = (id) => {

	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
}

const createToken = (user, statusCode, req, res) => {


	const token = signInToken(user._id);
	const dateNow = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000);
	


	const cookieOptions = {

		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
		httpOnly: true,
		sameSite: 'none',
		domain: '.herokuapp.com',
		secure: true
	}


	res.cookie('jwt', token, cookieOptions);
	// res.headers.authorization = token;
	user.password = undefined;


	res.status(statusCode).json({
		status: 'success',
		token,
		data: {data: user}
	})
	

}


exports.signUp = catchAsync(async (req, res, next) => {

	const {userName, email, password, firstName, lastName, skills, aboutMe, role, countryCode, localTimeZone, lastSeen, photo, isFacebook} = req.body;

	// console.log(firstName)
	const newUser = await User.create({
		userName,
		email,
		firstName,
		lastName,
		skills,
		aboutMe,
		role,
		countryCode,
		localTimeZone,
		lastSeen,
		password,
		photo,
		isFacebook,
		createdAt: Date.now()
	});

	createToken(newUser, 201, req, res);

});


exports.login = catchAsync(async (req, res, next) => {

	const {userNameOrEmail, password} = req.body;

	if(!userNameOrEmail || !password) {

		return next(new AppError('Please provide user name or email and password',400))
	}

	const query = {$or: [{email: {$regex: `^${userNameOrEmail}$`}}, {userName: {$regex: userNameOrEmail}}]};

	const user = await User.findOne(query).select('+password');

	if(!user || !(await user.correctPassword(password, user.password))){

		return next(new AppError('Incorrect user name, email or password',400))
	}

	createToken(user, 200, req, res);
	
});


exports.isLoggedIn = catchAsync(async (req, res, next) => {

	console.log({Cookie:req.cookies.jwt});
	if(req.cookies.jwt){
	
		try {

			const tokenDecoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

			const expTime = new Date(tokenDecoded.exp * 1000).getTime();
			const currentTime = new Date(Date.now()).getTime();
			
			if(currentTime > expTime) {

				return res.status(401).json({
				status: 'fail',
				requestedTime: new Date().toLocaleString(),
				message: 'token expired'
			});

			}

			const user = await User.findById(tokenDecoded.id);

			if(!user){
				next(new AppError('The user with this token no longer exist', 401));
			}

			return res.status(200).json({
				status: 'success',
				requestedTime: new Date().toLocaleString(),
				user
			});

		}catch(e) {
			console.log(e);

			return next();
		}

	}


	return res.status(200).json({status: 'success', noToken: true});
});


exports.logout = catchAsync(async (req, res, next) => {

	res.cookie('jwt', 'Logout from the site', {

		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
		sameSite: 'none',
		secure: true
	});

	res.status(200).json({status: 'success'});


});


exports.protect = catchAsync(async (req, res, next) => {

		let token;

		console.log({cookTest: req.cookies.jwt});
		
		if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

			token = req.headers.authorization.split(' ')[1];
		}
		else if(req.cookies.jwt){
			token = req.cookies.jwt;
		}

		if(!token){

			next(new AppError('You are not logged in. Please login', 401))

		}

		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		 const user = await User.findById(decoded.id);

		 if(!user){
		 	return next(new AppError('This user no longer exist', 400));
		 }

		 req.user = user;
		 next();

})