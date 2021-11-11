const express = require('express');

const bundleController = require('../controllers/bundleController');

const router = express.Router();


router.route('/').get(bundleController.getBundles);
router.route('/:bundleId').get(bundleController.getOneBundle)
router.route('/add').post(bundleController.addBundle);




module.exports = router;