const express = require('express');
const authController = require('../controllers/authController')

const router = express.Router();


router.route('/isloggedin').get(authController.isLoggedIn);
router.route('/logout').post(authController.logout);
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);



module.exports = router;