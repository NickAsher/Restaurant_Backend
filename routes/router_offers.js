const express = require('express') ;
const controllerOfferSpecial = require('../controllers/offers') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;
const imageMiddleware = require('../middleware/image_manipulation') ;

const router = express.Router() ;

let errorBackPageLink = "/specials" ;

const upload = validationMiddleware.upload ;
const uploadImageToS3 = imageMiddleware.uploadImageToS3 ;

const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;
const isAuthenticated = authenticationMiddleware.isAuthenticated('specials') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;
const hasMinPermissionLevel_Admin = authenticationMiddleware.hasMinPermissionLevel_Admin ;


router.get('/specials', isAuthenticated, errorHandler, controllerOfferSpecial.getAllOfferSpecials) ;

router.get('/specials/view/:offerId', isAuthenticated,[
  param('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, errorHandler, controllerOfferSpecial.getSingleOfferSpecial) ;

router.get('/specials/edit/:offerId', isAuthenticated, [
  param('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, errorHandler, controllerOfferSpecial.getEditOfferSpecial) ;

router.post('/specials/edit/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin,
  upload.single('post_Image'), checkFileMagicNumber, uploadImageToS3, [
    body('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
    body('offerTitle', "Invalid OfferSpecial Title").exists().notEmpty().trim().escape(),
    body('offerMessage', "Invalid OfferSpecial Message").exists().notEmpty().trim().escape(),
    body('offerOldImageFileName', "Invalid OfferSpecial Old Image File Name").exists().notEmpty().trim(),
], showValidationError, errorHandler, controllerOfferSpecial.postEditOfferSpecial) ;

router.get('/specials/add', isAuthenticated, errorHandler, controllerOfferSpecial.getAddOfferSpecial) ;

router.post('/specials/add/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin,
  upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, uploadImageToS3, [
      body('offerTitle', "Invalid OfferSpecial Title").exists().notEmpty().trim().escape(),
      body('offerMessage', "Invalid OfferSpecial Message").exists().notEmpty().trim().escape(),
], showValidationError, errorHandler, controllerOfferSpecial.postAddOfferSpecial) ;

router.post('/specials/delete', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin, [
  body('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('offerImageFileName', "Invalid OfferSpecial Image Name").exists().notEmpty().trim(),
], showValidationError, errorHandler,  controllerOfferSpecial.postDeleteOfferSpecial) ;

router.get('/specials/arrange', isAuthenticated, errorHandler, controllerOfferSpecial.getArrangeOfferSpecialsPage) ;

router.post('/specials/arrange', isAuthenticatedPostRequest, [
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }
    return true ;
  })
], showValidationError, errorHandler, controllerOfferSpecial.postOfferSpecialsPage) ;





module.exports = router ;