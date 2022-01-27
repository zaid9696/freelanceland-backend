const express = require('express');
const authController = require('../controllers/authController')
const bundleController = require('../controllers/bundleController');

const router = express.Router();

router.route('/dashboard').get(authController.protect,bundleController.getBundlesDashboard);
router.route('/search/:query').get(bundleController.searchBundles);
router.route('/latestBundles').get(bundleController.getBundlesByLatest);
router.route('/topRated').get(bundleController.getBundlesByTopRate);
router.route('/all/:userId/:bundleId').get(bundleController.getBundles);
router.route('/:bundleId').get(authController.protect,bundleController.getOneBundle)
router.route('/add').post(authController.protect, bundleController.uploadBundleImages, bundleController.resizeBundleImages,bundleController.addBundle);




module.exports = router;