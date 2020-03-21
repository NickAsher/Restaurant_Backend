const express = require('express') ;
const controllerOfferSpecial = require('../controllers/offers') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded ;


router.get('/specials', controllerOfferSpecial.getAllOfferSpecials) ;

router.get('/specials/view/:offerId',[
  param('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerOfferSpecial.getSingleOfferSpecial) ;

router.get('/specials/edit/:offerId', [
  param('offerId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerOfferSpecial.getEditOfferSpecial) ;

router.post('/specials/edit/save', upload.single('post_Image'), checkFileMagicNumber, [
  body('post_Id', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('post_OfferTitle', "Invalid OfferSpecial Title").exists().notEmpty().trim().escape(),
  body('post_OfferMessage', "Invalid OfferSpecial Message").exists().notEmpty().trim().escape(),
], showValidationError, controllerOfferSpecial.postEditOfferSpecial) ;

router.get('/specials/add', controllerOfferSpecial.getAddOfferSpecial) ;

router.post('/specials/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, [
  body('post_OfferTitle', "Invalid OfferSpecial Title").exists().notEmpty().trim().escape(),
  body('post_OfferMessage', "Invalid OfferSpecial Message").exists().notEmpty().trim().escape(),
], showValidationError, controllerOfferSpecial.postAddOfferSpecial) ;

router.post('/specials/delete', [
  body('post_OfferId', "Invalid OfferSpecial Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('post_ImageFileName', "Invalid OfferSpecial Image Name").exists().notEmpty().trim(),
], showValidationError,  controllerOfferSpecial.postDeleteOfferSpecial) ;

router.get('/specials/arrange', controllerOfferSpecial.getArrangeOfferSpecialsPage) ;

router.post('/specials/arrange', [
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a forEach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError, controllerOfferSpecial.postOfferSpecialsPage) ;





module.exports = router ;