const express = require('express') ;
const controllerAdmins = require('../controllers/admin') ;
const {body, validationResult} = require('express-validator') ;
const multer = require('multer') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const FileType = require('file-type') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;


const router = express.Router() ;

let errorBackPageLink = "/dashboard" ;

const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;
const isAuthenticated = authenticationMiddleware.isAuthenticated('dashboard') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;


router.get('/admins', isAuthenticated, errorHandler, controllerAdmins.getAllAdminsPage) ;

router.get('/admins/add', isAuthenticated, errorHandler, controllerAdmins.getAddNewAdminPage) ;

router.post('/admins/add/save', isAuthenticatedPostRequest, [
  body('fullname', "Fullname is invalid").exists().notEmpty().trim().escape(),
  body('email', "Email  is invalid").exists().notEmpty().isEmail().trim().normalizeEmail(),
  body('password', "Password is invalid").exists().notEmpty().isLength({min:12}).trim(),
  body('passwordAgain', "Password Again is invalid").exists().notEmpty().custom((value, {req})=>{
    return value == req.body.password ;
  }),
  body('isAccountActive', "isAccountAcitve is invalid").exists().notEmpty().isBoolean(),
  body('validUntill', "validUntill is invalid").exists().notEmpty().trim().escape(), //TODO check if it is a valid datetime
  body('role', "role is invalid").exists().notEmpty().trim().isIn(['ADMIN', 'VIEWER']),


], showValidationError, errorHandler, controllerAdmins.postAddNewAdminsPage) ;


module.exports = router ;