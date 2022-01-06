const express = require('express');

const offersController = require('../controllers/offersController');

const router = express.Router();

router.route('/').post(offersController.createOffer).get(offersController.getAllOffers);


module.exports = router;