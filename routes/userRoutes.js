const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router();


router.route('/dashboard/favBundles').get(authController.protect, userController.getDashboardFavourites);
router.route('/dashboard').get(authController.protect, userController.getDashboardUser);
router.route('/isloggedin').get(authController.isLoggedIn);
router.route('/logout').post(authController.logout);
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/:userName').get(userController.getOneUser);
router.route('/addFavourite/:userId').patch(authController.protect,userController.addFavourite).delete(authController.protect,userController.removeFavourites)
router.route('/updateMe').patch(authController.protect,userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser);


module.exports = router;