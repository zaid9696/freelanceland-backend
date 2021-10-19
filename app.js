const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');

const AppError  = require('./utils/appError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');

const app = express();


app.use(morgan('dev'));


app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({
	extended: true,
	limit: '10px'
}))


app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {

	next(new AppError(`Can't find ${req.originalUrl} on server`, 404));

});

app.use(errorController);

module.exports = app;

