const {body, param, validationResult} = require('express-validator') ;
const multer = require('multer') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const FileType = require('file-type') ;
const logger = require('./logging') ;


exports.upload = multer({
  storage : multer.diskStorage({
      destination : function(req, file, callback) {
        callback(null, './images');
      },
      filename: function (req, file, callback) {
        let newFileName = Date.now() + "_" + file.originalname ;
        req.myFileName = newFileName ; // adding the newly created filename to my request
        callback(null , newFileName);
      }
  }),
  fileFilter: function (req, file, callback) {
    /* The file filter only looks at the extension of the image. If a text file is renamed to .png,
     * Then multer will accept its extension and its mimetype also(doesn't really checks the buffer of the file)
     * So we use fileMagicNumber (from package'file-type') as a check for that.
     * But the question arises, what is the use of this check
     * So the reason we use multer is that, if someone uploaded a real image.png and changed it to image.xyz,
     * then its fileMagicNumber will be valid. But we don't want that, so in that case , multer is useful
     */

    let fileExtension = path.extname(file.originalname);
    if(fileExtension !== '.png' && fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
      logger.warn(`{'warn' : 'Multer Validation Error, File uploaded with wrong extension of ${fileExtension} }','url':'${req.originalUrl}'}`) ;
      return callback(new Error(`Files with this extension ${fileExtension} are not allowed`)) ;
    }
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      logger.warn(`{'warn' : 'Multer Validation Error, File uploaded with wrong mimetype of ${file.mimetype} }','url':'${req.originalUrl}'}`) ;
      return callback(new Error(`files with this mimetype (${file.mimetype}) are not allowed`)) ;
    }
    callback(null, true) ;
  },
  limits:{
    // fileSize: 1024 * 1024
  },
  // onError was removed in v1.0.0
}) ;


exports.checkFileMagicNumber = async (req, res, next)=>{
  //firstly check if there is a file, because in edit-something pages, there might not be a new file upload.
  if(req.file){
    /*check if file has correct magic number
     * if it finds a valid file Type, then data returned is an object like this
     * { ext : 'png', mime : 'image/png' }
     * Otherwise, data is undefined
     *
     * So if we do not get a valid image mime,
     * we set the value of req.myFileError_MagicNumber to some error
     * Then in another middleware, where we check for errors, we also check for req.myFileError_MagicNumber
     * If there are no errors, then this req.myFileError_MagicNumber would be undefined.
     * otherwise, it exists, meaning there are some errors.
      * So if it exists, we delete the file from storage and show error page to the user.
     */
    let data = await FileType.fromFile(req.file.path) ;
    if(data == undefined){
      req.myFileError_MagicNumber = "File  magic number is undefined" ;

    } else{
      if(data.mime !== 'image/png' && data.mime !== 'image/jpg' && data.mime !== 'image/jpeg'){
        req.myFileError_MagicNumber = "File magic number is not a valid image signature " ;
      }
    }
    next() ;

  }else {
    next() ;
  }
} ;


exports.checkFileIsUploaded = (backPageLink)=>{
  /* the reason that we have a seperate middleware for checking if file is uploaded
   * rather than just doing this check in showValidationError
   * Is that not all web-pages need to have a file upload.
   * for example, in edit page for menu items, user might not have uploaded a file
   * so this is only needed for pages, where file upload is absolutely necessary, like adding new-Item pages
   */
  return (req, res, next)=>{

    if(!req.file){
      logger.warn(`{'warn' : 'File is not uploaded','url':'${req.originalUrl}'}`) ;
       res.status(422).render('general/error.hbs', {
        showBackLink : true,
        backLink : backPageLink,
        error :"File is not uploaded",
      }) ;
    }else{
      next() ;
    }
  } ;
} ;


exports.showValidationError = (backPageLink)=>{
  return (req, res, next)=>{

    const errors = validationResult(req) ;

    if (!errors.isEmpty()  || req.myFileError_MagicNumber) {

      if(req.file){
        //deleting the image from multer
        let newImageFileName = req.myFileName ;
        fs.unlinkSync(Constants.IMAGE_PATH + newImageFileName) ;
      }

      let errorObject = {
        fileErrors : req.myFileError_MagicNumber,
        validationErrors : errors.array()
      } ;

      logger.warn(`{'warn' : ${(JSON.stringify(errorObject))} ,'url':'${req.originalUrl}'}`) ;

      res.status(422).render('general/error.hbs', {
        showBackLink : true,
        backLink : backPageLink,
        error : errorObject
      }) ;
    } else {
      next() ;
    }
  } ;
} ;

exports.myErrorHandler = (backLink)=>{
  return (err, req, res, next)=>{
    logger.warn(`{'warn' : '${(JSON.stringify(err.toString()))}' ,'url':'${req.originalUrl}'}`) ;
    res.status(422).render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : {
        string : err.toString(),
        err
      }
    }) ;
  } ;
} ;
