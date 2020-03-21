const express = require('express') ;
const controllerInfo = require('../controllers/info') ;
const {body, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;
const showValidationError = validationMiddleware.showValidationError ;


router.get('/about', controllerInfo.getAboutPage) ;

router.get('/about/edit', controllerInfo.getAboutEditPage) ;

router.post('/about/edit/save', [
    body('post_aboutUsData', "Invalid AboutUs data").exists().notEmpty()
], showValidationError, controllerInfo.postAboutEditPage) ;

router.get('/contact', controllerInfo.getContactPage) ;
router.get('/contact/edit', controllerInfo.getContactEditPage) ;

router.post('/contact/edit/save', [
  body('post_name', 'Invalid Restaurant Name').exists().notEmpty().trim(),
  body('post_addr1', 'Invalid Address Line 1').exists().notEmpty().trim(),
  body('post_addr2', 'Invalid Address Line 2').exists().notEmpty().trim(),
  body('post_addr3', 'Invalid Address Line 3').exists().notEmpty().trim(),
  body('post_phone', 'Invalid Phone Number').exists().notEmpty().isNumeric().trim().escape(),
  body('post_email', 'Invalid Email Address').exists().notEmpty().isEmail().trim().escape(),
  body('post_latitude', 'Invalid Latitude').exists().notEmpty().trim().escape(),
  body('post_longitude', 'Invalid Longitude').exists().notEmpty().trim().escape(),
  body('linkFacebook', 'Invalid Facebook Link').exists().notEmpty().isURL().trim(),
  body('linkInstagram', 'Invalid Instagram Link').exists().notEmpty().isURL().trim(),
  body('linkTwitter', 'Invalid Twitter Link').exists().notEmpty().isURL().trim(),
  body('linkYoutube', 'Invalid Youtube Link').exists().notEmpty().isURL().trim(),
],  showValidationError, controllerInfo.postContactEditPage) ;


module.exports = router ;