const express = require('express') ;
const controllerBlogs = require('../controllers/blogs') ;
const {body, param, validationResult} = require('express-validator') ;
const multer = require('multer') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const FileType = require('file-type') ;

const router = express.Router() ;

let multerStorage = multer.diskStorage({
  destination : function(req, file, callback) {
    callback(null, './images');
  },
  filename: function (req, file, callback) {
    let newFileName = Date.now() + "_" + file.originalname ;
    req.myFileName = newFileName ; // adding the newly created filename to my request
    callback(null , newFileName);
  }
}) ;
let upload = multer({
  storage : multerStorage,
  fileFilter: function (req, file, callback) {
    /* The file filter only looks at the extension of the image. If a text image is renamed to .png,
     * Then multer will accept its extension and its mimetype also(doesn't really checks the buffer of the file)
     * So we use fileMagicNumber (from package'file-type') as a check for that.
     * But the question arises, what is the use of this check
     * So the reason we use multer is that, if someone uploaded a real image.png and changed it to image.xyz,
     * then its fileMagicNumber will be valid. But we don't want that, so in that case , multer is useful
     *
     */

    let fileExtension = path.extname(file.originalname);
    if(fileExtension !== '.png' && fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
      return callback(new Error('Files with this extension are not allowed')) ;
    }
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return callback(new Error(`files with this mimetype (${file.mimetype}) are not allowed`)) ;
    }
    callback(null, true) ;
  },
  limits:{
    fileSize: 1024 * 1024
  }
}) ;


const showValidationError = (req, res, next)=>{
  const errors = validationResult(req) ;

  if (!errors.isEmpty()  || req.myFileMagicNumberError ) {

    if(req.file){
      //deleting the image from multer
      let newImageFileName = req.myFileName ;
      fs.unlinkSync(Constants.IMAGE_PATH + newImageFileName) ;
    }

    return res.status(422).send({
      status:false,
      fileError : req.myFileMagicNumberError,
      error : errors.array()
    });
  } else {
    next() ;
  }
} ;

const checkFileMagicNumber = async (req, res, next)=>{
  if(req.file){
    /*check if file has correct magic number
     * if it finds a valid file Type, then data returned is an object like this
     * { ext : 'png', mime : 'image/png' }
     * Otherwise, data is undefined
     */
    console.log(req.file) ;
    let data = await FileType.fromFile(req.file.path) ;
    console.log(data) ;
    if(data == undefined){
      req.myFileMagicNumberError = "File  magic number is undefined" ;

    } else{
      if(data.mime !== 'image/png' && data.mime !== 'image/jpg' && data.mime !== 'image/jpeg'){
        req.myFileMagicNumberError = "File magic number is not a valid image signature " ;
      }
    }
    next() ;

  }else {
    next() ;
  }
} ;




router.get('/blogs', controllerBlogs.getAllBlogsPage) ;

router.get('/blogs/add', controllerBlogs.getAddNewBlogPage) ;

router.post('/blogs/add/save', upload.single('post_Image'),
  [
    body('post_BlogAuthor', "Invalid Author Name").exists().not().isEmpty().trim().escape(),
    body('post_BlogTitle', "Invalid Blog Title").exists().not().isEmpty().trim().escape(),
    body('post_BlogContent', "Invalid blog content").exists().not().isEmpty(),
  ],
  checkFileMagicNumber, showValidationError,
  controllerBlogs.postAddNewBlogPage) ;

router.post('/blogs/delete',  controllerBlogs.postDeleteBlogPage) ;

router.get('/blogs/:blogId',
  [
    param('blogId', "Invalid Blog Id").exists().not().isEmpty().isNumeric({no_symbols: true}).trim().escape(),
  ],
  showValidationError,
  controllerBlogs.getSingleBlogPage) ;

router.get('/blogs/edit/:blogId',
  [
    param('blogId', "Invalid Blog Id").exists().not().isEmpty().isNumeric({no_symbols: true}).trim().escape(),
  ],
  showValidationError,
  controllerBlogs.getSingleBlogEditPage) ;

router.post('/blogs/edit/save', upload.single('post_Image'),
  [
    body('post_BlogId', "Invalid BlogId").exists().not().isEmpty().isNumeric().trim().escape(),
    body('post_BlogAuthor', "Invalid Author Name").exists().not().isEmpty().trim().escape(),
    body('post_BlogTitle', "Invalid Blog Title").exists().not().isEmpty().trim().escape(),
    body('post_BlogContent', "Invalid blog content").exists().not().isEmpty(),
  ],
  showValidationError, controllerBlogs.postEditBlogPage) ;



module.exports = router ;