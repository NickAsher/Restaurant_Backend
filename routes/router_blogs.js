const express = require('express') ;
const controllerBlogs = require('../controllers/blogs') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;
const imageMiddleware = require('../middleware/image_manipulation') ;

const router = express.Router() ;

let errorBackPageLink = "/blogs" ;

const upload = validationMiddleware.upload ;
const uploadImageToS3 = imageMiddleware.uploadImageToS3 ;

const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;
const isAuthenticated = authenticationMiddleware.isAuthenticated('blogs') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;
const hasMinPermissionLevel_Admin = authenticationMiddleware.hasMinPermissionLevel_Admin ;

router.get('/blogs', isAuthenticated, errorHandler, controllerBlogs.getAllBlogsPage) ;

router.get('/blogs/view/:blogId', isAuthenticated, [
  param('blogId', "Invalid Blog Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, errorHandler, controllerBlogs.getSingleBlogViewPage) ;

router.get('/blogs/edit/:blogId', isAuthenticated, [
  param('blogId', "Invalid Blog Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, errorHandler, controllerBlogs.getSingleBlogEditPage) ;

router.post('/blogs/edit/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin,
  upload.single('post_Image'), checkFileMagicNumber, uploadImageToS3, [
    body('blogId', "Invalid BlogId").exists().notEmpty().isNumeric().trim().escape(),
    body('blogOldImageFileName', "Invalid old image file name").exists().notEmpty().trim(),
    body('blogAuthorName', "Invalid Author Name").exists().notEmpty().trim().escape(),
    body('blogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
    body('blogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError, errorHandler, controllerBlogs.postEditBlogPage) ;

router.get('/blogs/add', isAuthenticated, errorHandler, controllerBlogs.getAddNewBlogPage) ;

router.post('/blogs/add/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin,
  upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, uploadImageToS3, [
    body('blogAuthorName', "Invalid Author Name").exists().notEmpty().trim().escape(),
    body('blogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
    body('blogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError, errorHandler, controllerBlogs.postAddNewBlogPage) ;

router.post('/blogs/delete', isAuthenticatedPostRequest, hasMinPermissionLevel_Admin, [
  body('blogId', "invalid blogId").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
  body('blogImageFileName', "invalid image name").exists().notEmpty().trim().escape(),
], showValidationError, errorHandler, controllerBlogs.postDeleteBlogPage) ;

module.exports = router ;