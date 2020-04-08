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

router.post('/forgotPassword',
  [
    body('post_Email').not().isEmpty().isEmail()
      .withMessage("Valid email not provied").normalizeEmail(),
  ],
  showValidationError, controllerAuth.postForgotPassword) ;

router.get('/resetPassword/:resetToken', controllerAuth.getResetPasswordTokenPage) ;

router.post('/resetPassword',
  [
    body('post_resetToken', "ressetToken does noot exist").exists().not().isEmpty(),
    body('post_newPassword', "Password must be 8 characters long and must contain atleast number and 1 special character")
      .isLength({min:8}),
    body('post_newPasswordAgain', "Passwords do not match")
      .isLength({min:8}).custom((value, {req})=>{
      return value == req.body.post_newPassword ;
    }),
  ],
  showValidationError,
  controllerAuth.postResetPasswordToken) ;






module.exports = router ;





