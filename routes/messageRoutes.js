const express = require('express');

const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');


const router = express.Router();


router.route('/').get(messageController.getMessage).post(messageController.postMessage);



module.exports = router;