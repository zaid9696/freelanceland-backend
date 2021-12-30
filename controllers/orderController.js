const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const paypal = require("@paypal/checkout-server-sdk")
const Bundle =  require('../models/bundleModel');

const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

const Order  = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError');



	// const storeItems = new Map([
	// 	  [1, { price: 100, name: "Learn React Today" }],
	// 	  [2, { price: 200, name: "Learn CSS Today" }],
	// 	])	


	// 	const request = new paypal.orders.OrdersCreateRequest()
 //  		const total = req.body.items.reduce((sum, item) => {
	//     return sum + storeItems.get(item.id).price * item.quantity
	//   }, 0)
	//   request.prefer("return=representation")
	//   request.requestBody({
	//     intent: "CAPTURE",
	//     purchase_units: [
	//       {
	//         amount: {
	//           currency_code: "USD",
	//           value: total,
	//           breakdown: {
	//             item_total: {
	//               currency_code: "USD",
	//               value: total,
	//             },
	//           },
	//         },
	//         items: req.body.items.map(item => {
	//           const storeItem = storeItems.get(item.id)
	//           return {
	//             name: storeItem.name,
	//             unit_amount: {
	//               currency_code: "USD",
	//               value: storeItem.price,
	//             },
	//             quantity: item.quantity,
	//           }
	//         }),
	//       },
	//     ],
	//   })

	//   try {
	//     const order = await paypalClient.execute(request)
	//     res.json({ id: order.result.id })
	//   } catch (e) {
	//     res.status(500).json({ error: e.message })
	//   }



exports.processingPaymentPayPal = catchAsync(async (req, res, next) => {

		const {id} = req.body.items;	

		const bundle = await Bundle.findById(id);


	if(bundle){

		const request = new paypal.orders.OrdersCreateRequest()	
		  request.prefer("return=representation")
		  request.requestBody({
		    intent: "CAPTURE",
		    purchase_units: [
		      {
		        amount: {
		          currency_code: "USD",
		          value: bundle.price,
		          breakdown: {
		            item_total: {
		              currency_code: "USD",
		              value: bundle.price,
		            },
		          },
		        },
		        items: [{
		            name: bundle.title,
		            unit_amount: {
	              currency_code: "USD",
	              value: bundle.price,
	            },
	            quantity: 1,
		          }],
		      },
		    ],
		  })
	

		  try {
		    const order = await paypalClient.execute(request)
		    res.json({ id: order.result.id })
		  } catch (e) {
		    res.status(500).json({ error: e.message })
		  }}


})

exports.updateOrder = catchAsync(async (req, res, next) => {

		const {orderId} = req.params;
		const {accepted, notAccepted, completed, cancelled, delivered, deliveredDesc, active, buyerReview, sellerReview} = req.body;
		const updatedOrderClient = {
			accepted,
			notAccepted,
			completed,
			active,
			buyerReview,
			timeStampBuyer: new Date(Date.now())

		}

		const updatedOrderSeller = {
			cancelled,
			delivered,
			deliveredDesc,
			active,
			notAccepted,
			sellerReview,
			timeStampBuyer: notAccepted ? new Date(Date.now()) : undefined,
			timeStampSeller: !notAccepted ? new Date(Date.now()) : undefined
		}

		const isOrder = await Order.findById(orderId);
		let order ;
		let isUser;
		if(isOrder.user.toString() === req.user.id){
		
			 order = await Order.findByIdAndUpdate(orderId, updatedOrderClient, {
				new: true
			}).populate('bundle user buyerReview sellerReview', 'userName title price images photo slug review rating createdAt buyer seller');;
			isUser = true;
		}else if(isOrder.seller.toString() === req.user.id) {

					

		  if(!deliveredDesc && !cancelled && !notAccepted && !sellerReview){
		  	
				return next(new AppError('You must provide a MESSAGE for the Buyer'));
			}
			

			order = await Order.findByIdAndUpdate(orderId, updatedOrderSeller, {
				new: true
			}).populate('bundle user sellerReview buyerReview', 'userName title price images photo slug review rating createdAt buyer seller');
			isUser = false
		}

		
		res.status(200).json({
			status: 'success',
			order,
			isUser: isUser
		})
})

exports.getAllOrders = catchAsync(async (req, res, next) => {

	const orders = await Order.find();

	res.status(200).json({
		status: 'success',
		orders
	});

})

exports.getOneOrder = catchAsync(async (req, res, next) => {


		const {orderId} = req.params;
		

		const order = await Order.findOne({
			   $and: [
			      { orderId: { $in: orderId } },
			      {$or: [{user: req.user.id}, {seller: req.user.id}]}
			   ]
			}).populate('bundle user buyerReview sellerReview', 'userName title price images photo slug review rating createdAt buyer seller');

		let isUser;


		if (order.user.id === req.user.id) {

					isUser = true;
		}else {

			isUser = false;
		}

		if(!order){

		  return next(new AppError('The user is not authorized to access the page',401))
		}

		res.status(200).json({
			status: 'success',
			order,
			isUser,
			// expiredTime
		});
}) 

exports.createOrder = catchAsync(async (req, res, next) => {

	const {active, cancelled, completed, orderId, bundle, user, deliverDate, seller} = req.body;

	// const deliverDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
	// console.log(user);
	let newOrder = await Order.create({
		active,
		cancelled,			
		completed,
		orderId,
		deliverDate,
		bundle,
		user,
		orderId,
		seller,
		createdAt:Date.now()
	});

	// newOrder = await newOrder.populate('user', 'userName');

	res.status(201).json({
		status: 'success',
		newOrder
	})
});


