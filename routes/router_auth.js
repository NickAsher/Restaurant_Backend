const express = require('express') ;
const controllerAuth = require('../controllers/auth') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/" ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;

const authRedirectHome = authenticationMiddleware.authRedirectHome ;


router.get('/login', authRedirectHome, errorHandler, controllerAuth.getLoginPage) ;

router.post('/login',[
  body('email', "Invalid Email address").exists().notEmpty().isEmail().trim().normalizeEmail(),
  body('password', "Invalid Password ").exists().notEmpty().isLength({min:8}).trim(),
], showValidationError, errorHandler, controllerAuth.postLoginPage) ;

router.post('/forgotPassword', [
  body('post_Email', 'Invalid Email Address').exists().notEmpty().isEmail().trim().normalizeEmail(),
], showValidationError, errorHandler, controllerAuth.postForgotPassword) ;


router.get('/signout', errorHandler, controllerAuth.postSignout) ;

router.get('/resetPassword/:resetToken', errorHandler, controllerAuth.getResetPasswordTokenPage) ;

router.post('/resetPassword', [
  body('post_resetToken', "ressetToken does noot exist").exists().not().isEmpty(),
  body('post_newPassword', "Password must be 8 characters long and must contain atleast number and 1 special character")
    .isLength({min:8}).trim(),
  body('post_newPasswordAgain', "Passwords do not match")
    .isLength({min:8}).custom((value, {req})=>{
    return value == req.body.post_newPassword ;
  }),
], showValidationError, errorHandler, controllerAuth.postResetPasswordToken) ;






module.exports = router ;





