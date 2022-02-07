const AppError = require('../utils/appError');


const objectIdErrorHandler = (err) => {

	return new AppError('You are not allowed to access the content', 401);
}

const duplicateErrorHandler = (err) => {

	const val = Object.values(err.keyValue);
	const field = Object.keys(err.keyValue);
	// console.log(field);
	const message = `Duplicate ${field} field: ${val}. Please use another Value`;

	return new AppError(message, 400);

}

const validationHandler = (err) => {

	const errors = Object.values(err.errors).map(el => el.message);

	const message = `Invalid data. ${errors.join('. ')}`

	return new AppError(message, 400);

}


const sendErrorDev = (req, res, err) => {

	return res.status(err.statusCode).json({

			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack
	})

}


const sendErrorPro = (req, res, err) => {

	if(err.isOperational){

		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		})

	}

	return res.status(500).json({
		status: 'Error',
		message: 'Something Went Wrong'
	})
}


module.exports = (err, req, res, next) => {

	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'err';

		// console.log(process.env.NODE_ENV);
	if(process.env.NODE_ENV === 'development'){
		sendErrorDev(req, res, err);
	}

	if(process.env.NODE_ENV === 'production'){

		if(err.code === 11000) err = duplicateErrorHandler(err);
		if(err.name === 'ValidationError') err = validationHandler(err);
		if(err.kind === 'ObjectId') err = objectIdErrorHandler(err);

		sendErrorPro(req, res, err);
	}

}