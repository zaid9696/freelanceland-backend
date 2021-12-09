const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const paypal = require("@paypal/checkout-server-sdk")

const AppError  = require('./utils/appError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const orderRoutes = require('./routes/orderRoutes');
const messageRoutes = require('./routes/messageRoutes');


const app = express();



app.use(morgan('dev'));

app.use(cookieParser());

app.use((req, res, next) => {

	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', `${process.env.URL_PATH}`);
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



const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
])


app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity
  }, 0)
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.price,
            },
            quantity: item.quantity,
          }
        }),
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.use('/api/users', userRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);


app.all('*', (req, res, next) => {

	next(new AppError(`Can't find ${req.originalUrl} on server`, 404));

});

app.use(errorController);

module.exports = app;

