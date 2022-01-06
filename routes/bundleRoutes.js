const express = require('express');
const authController = require('../controllers/authController')
const bundleController = require('../controllers/bundleController');

const router = express.Router();

router.route('/latestBundles').get(bundleController.getBundlesByLatest);
router.route('/topRated').get(bundleController.getBundlesByTopRate);
router.route('/all/:userId/:bundleId').get(bundleController.getBundles);
router.route('/:bundleId').get(authController.protect,bundleController.getOneBundle)
router.route('/add').post(bundleController.addBundle);




module.exports = router;