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
], showValidationError('/blogs'), controllerBlogs.getSingleBlogViewPage) ;

router.get('/blogs/edit/:blogId', [
  param('blogId', "Invalid Blog Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError('/blogs'), controllerBlogs.getSingleBlogEditPage) ;

router.post('/blogs/edit/save', upload.single('post_Image'), checkFileMagicNumber, [
  body('blogId', "Invalid BlogId").exists().notEmpty().isNumeric().trim().escape(),
  body('blogOldImageFileName', "Invalid old image file name").exists().notEmpty().trim(),
  body('blogAuthorName', "Invalid Author Name").exists().notEmpty().trim().escape(),
  body('blogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
  body('blogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError('/blogs'), controllerBlogs.postEditBlogPage) ;

router.get('/blogs/add', controllerBlogs.getAddNewBlogPage) ;

router.post('/blogs/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, [
  body('blogAuthorName', "Invalid Author Name").exists().notEmpty().trim().escape(),
  body('blogTitle', "Invalid Blog Title").exists().notEmpty().trim().escape(),
  body('blogContent', "Invalid blog content").exists().notEmpty(),
], showValidationError('/blogs'), controllerBlogs.postAddNewBlogPage) ;

router.post('/blogs/delete', [
  body('blogId', "invalid blogId").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
  body('blogImageFileName', "invalid image name").exists().notEmpty().trim().escape(),
], showValidationError('/blogs'), controllerBlogs.postDeleteBlogPage) ;

module.exports = router ;