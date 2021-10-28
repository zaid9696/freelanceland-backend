const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const AppError  = require('./utils/appError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');

const app = express();




app.use(morgan('dev'));


app.use((req, res, next) => {

	res.setHeader('Access-Control-Allow-Origin', process.env.URL_PATH);
	res.header('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

// const corsOptions = {
//     credentials: true,
//     ///..other options
//   };

// app.use(cors(corsOptions));

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(express.urlencoded({
	extended: true,
	limit: '10px'
}));




app.use('/api/users', userRoutes);


app.all('*', (req, res, next) => {

	next(new AppError(`Can't find ${req.originalUrl} on server`, 404));

});

app.use(errorController);

module.exports = app;

