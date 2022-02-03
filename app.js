const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');



const AppError  = require('./utils/appError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const orderRoutes = require('./routes/orderRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const offersRoutes = require('./routes/offersRoutes');


const app = express();

app.use('/public/images', express.static(path.join('public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(cookieParser());

app.use((req, res, next) => {

	res.setHeader('Access-Control-Allow-Origin', `${process.env.URL_PATH}`);
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

const corsOptions = {
    credentials: true,
   	origin: `${process.env.URL_PATH}`
 };

app.use(cors(corsOptions));

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({
	extended: true,
	limit: '10px'
}));




app.use('/api/users', userRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offersRoutes);


app.all('*', (req, res, next) => {

	next(new AppError(`Can't find ${req.originalUrl} on server`, 404));

});

app.use(errorController);

module.exports = app;

