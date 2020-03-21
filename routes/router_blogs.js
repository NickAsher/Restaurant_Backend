const express = require('express') ;
const controllerBlogs = require('../controllers/blogs') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded ;



router.get('/blogs', controllerBlogs.getAllBlogsPage) ;

router.get('/blogs/view/:blogId', [
  param('blogId', "Invalid Blog Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerBlogs.getSingleBlogViewPage) ;

router.get('/blogs/edit/:blogId', [
  param('blogId', "Invalid Blog Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerBlogs.getSingleBlogEditPage) ;

router.post('/blogs/edit/save', upload.single('post_Image'), checkFileMagicNumber, [
  body('post_BlogId', "Invalid BlogId").exists().notEmpty().isNumeric().trim().escape(),
  body('post_BlogAuthor', "Invalid Author Name").exists().notEmpty().trim().escape(),
  body('post_BlogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
  body('post_BlogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError, controllerBlogs.postEditBlogPage) ;

router.get('/blogs/add', controllerBlogs.getAddNewBlogPage) ;

router.post('/blogs/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, [
  body('post_BlogAuthor', "Invalid Author Name").exists().notEmpty().trim().escape(),
  body('post_BlogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
  body('post_BlogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError, controllerBlogs.postAddNewBlogPage) ;

router.post('/blogs/delete', [
  body('post_BlogId', "invalid blogId").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
  body('post_ImageFileName', "invalid image name").exists().notEmpty().trim().escape(),
], showValidationError, controllerBlogs.postDeleteBlogPage) ;

module.exports = router ;