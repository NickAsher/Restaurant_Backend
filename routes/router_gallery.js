const express = require('express') ;
const controllerGallery = require('../controllers/gallery') ;
const {body, validationResult} = require('express-validator') ;
const multer = require('multer') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const FileType = require('file-type') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded ;






router.get('/gallery', controllerGallery.getAllGalleryItemPage) ;


router.get('/gallery/add', controllerGallery.getAddGalleryItemPage) ;


router.post('/gallery/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber,
  showValidationError, controllerGallery.postAddGalleryItemPage) ;


router.post('/gallery/delete',
  [
    body('post_GalleryItemId', "Invalid gallery Item Id").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
    body('post_GalleryItemName', "Invalid image name").exists().notEmpty().trim().escape(),
  ],
  showValidationError, controllerGallery.postDeleteGalleryItemPage) ;


router.get('/gallery/arrange', controllerGallery.getArrangeGalleryItemsPage) ;


router.post('/gallery/arrange',
  [
    body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
      // we have to return a boolean in this function
      let sortedArray = JSON.parse(value) ;
      if(!Array.isArray(sortedArray)){
        return false ;
      }
      for(let i=0;i<sortedArray.length;i++){
        /* check that each element is a valid integer id ;
         * if it is not, return false, else go on.
         * we are not using a foreach loop because if we return something inside foreach loop,
         * it is only returned inside that iteration
         */
        if(/^\+?\d+$/.test(sortedArray[i]) === false){
          return false ;
        }
      }


      return true ;


    })
  ],
  showValidationError, controllerGallery.postArrangeGalleryItemsPage) ;


module.exports = router ;