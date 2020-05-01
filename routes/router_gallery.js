const express = require('express') ;
const controllerGallery = require('../controllers/gallery') ;
const {body, validationResult} = require('express-validator') ;
const multer = require('multer') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const FileType = require('file-type') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/gallery" ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;
const isAuthenticated = authenticationMiddleware.isAuthenticated('gallery') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;
const hasMinPermissionLevel_Admin = authenticationMiddleware.hasMinPermissionLevel_Admin ;




router.get('/gallery', isAuthenticated, errorHandler, controllerGallery.getAllGalleryItemPage) ;

router.get('/gallery/add', isAuthenticated, errorHandler, controllerGallery.getAddGalleryItemPage) ;

router.post('/gallery/add/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin,
  upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber,
  showValidationError, errorHandler, controllerGallery.postAddGalleryItemPage) ;

router.post('/gallery/delete', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin, [
  body('galleryItemId', "Invalid gallery Item Id").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
  body('galleryImageFileName', "Invalid image name").exists().notEmpty().trim().escape(),
], showValidationError, errorHandler, controllerGallery.postDeleteGalleryItemPage) ;

router.get('/gallery/arrange', isAuthenticated, controllerGallery.getArrangeGalleryItemsPage) ;

router.post('/gallery/arrange', isAuthenticatedPostRequest, [
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
], showValidationError, errorHandler, controllerGallery.postArrangeGalleryItemsPage) ;


module.exports = router ;