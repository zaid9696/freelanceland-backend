const express = require('express');

const authController = require('../controllers/authController');
const offersController = require('../controllers/offersController');

const router = express.Router();

router.route('/dashboard/buyers').get(authController.protect, offersController.getAllOtherOffers);
router.route('/dashboard').get(authController.protect, offersController.getAllMyOffers);
router.route('/').post(authController.protect, offersController.createOffer).get(offersController.getAllOffers);


module.exports = router;