const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router();


router.route('/isloggedin').get(authController.isLoggedIn);
router.route('/logout').post(authController.logout);
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/allUsers').get(authController.protect,userController.getUsers);
router.route('/updateMe').patch(authController.protect,userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser);


module.exports = router;