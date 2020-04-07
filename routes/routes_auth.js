const express = require('express') ;
const controllerAuth = require('../controllers/auth') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;


const router = express.Router() ;

let errorBackPageLink = "/" ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;



router.get('/login', errorHandler, controllerAuth.getLoginPage) ;

router.post('/login', [
  body('email', "Invalid Email address").exists().notEmpty().isEmail().trim().normalizeEmail(),
  body('password', "Invalid Password ").exists().notEmpty().isLength({min:8}).trim(),
], showValidationError, errorHandler, controllerAuth.postLoginPage) ;






module.exports = router ;





