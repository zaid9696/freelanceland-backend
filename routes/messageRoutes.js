const express = require('express');

const {getMessageByUserName, usersMessages} = require('../controllers/messageController')
const authController = require('../controllers/authController');


const router = express.Router();


router.route('/usersMessages').get(authController.protect ,usersMessages);
router.route('/:userName').get(authController.protect ,getMessageByUserName);



module.exports = router;