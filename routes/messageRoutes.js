const express = require('express');

const {getMessageByUserName} = require('../controllers/messageController')
const authController = require('../controllers/authController');


const router = express.Router();



router.route('/:userName').get(authController.protect ,getMessageByUserName);



module.exports = router;