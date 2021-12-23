const express = require('express');

const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');


const router = express.Router();

router.route('/:notificationId').patch(authController.protect, notificationController.updateNotification);
router.route('/').post(authController.protect,notificationController.createNotification).get(authController.protect,notificationController.getAllNotifications)


module.exports = router;