const express = require('express') ;
const controllerInfo = require('../controllers/info') ;
const {body, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;
const showValidationError = validationMiddleware.showValidationError ;


router.get('/about', controllerInfo.getViewAboutPage) ;

router.get('/about/edit', controllerInfo.getEditAboutPage) ;

router.post('/about/edit/save', [
    body('aboutUsData', "Invalid AboutUs data").exists().notEmpty()
], showValidationError('/about'), controllerInfo.postEditAboutPage) ;

router.get('/contact', controllerInfo.getViewContactPage) ;
router.get('/contact/edit', controllerInfo.getEditContactPage) ;

router.post('/contact/edit/save', [
  body('restaurantName', 'Invalid Restaurant Name').exists().notEmpty().trim(),
  body('restaurantAddressLine1', 'Invalid Address Line 1').exists().notEmpty().trim(),
  body('restaurantAddressLine2', 'Invalid Address Line 2').exists().notEmpty().trim(),
  body('restaurantAddressLine3', 'Invalid Address Line 3').exists().notEmpty().trim(),
  body('restaurantPhone', 'Invalid Phone Number').exists().notEmpty().isNumeric().trim().escape(),
  body('restaurantEmail', 'Invalid Email Address').exists().notEmpty().isEmail().trim().escape(),
  body('restaurantLatitude', 'Invalid Latitude').exists().notEmpty().trim().escape(),
  body('restaurantLongitude', 'Invalid Longitude').exists().notEmpty().trim().escape(),
  body('restaurantLinkFacebook', 'Invalid Facebook Link').exists().notEmpty().isURL().trim(),
  body('restaurantLinkInstagram', 'Invalid Instagram Link').exists().notEmpty().isURL().trim(),
  body('restaurantLinkTwitter', 'Invalid Twitter Link').exists().notEmpty().isURL().trim(),
  body('restaurantLinkYoutube', 'Invalid Youtube Link').exists().notEmpty().isURL().trim(),
],  showValidationError('/contact'), controllerInfo.postEditContactPage) ;


module.exports = router ;