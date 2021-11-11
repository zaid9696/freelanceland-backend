const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');


const router = express.Router();



router.route('/').post(orderController.createOrder).get(orderController.getAllOrders);
router.route('/:orderId').get(authController.protect, orderController.getOneOrder).patch(authController.protect, orderController.updateOrder);


module.exports = router;