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

router.get('/admins/edit/:adminId', isAuthenticated, errorHandler, controllerAdmins.getEditAdminPage) ;


router.post('/admins/edit/save-details', isAuthenticatedPostRequest, [
  body('fullname', "Fullname is invalid").exists().notEmpty().trim().escape(),
  body('email', "Email  is invalid").exists().notEmpty().isEmail().trim().normalizeEmail(),
  body('isAccountActive', "isAccountAcitve is invalid").exists().notEmpty().isBoolean(),
  body('validUntill', "validUntill is invalid").exists().notEmpty().trim().escape(), //TODO check if it is a valid datetime
  body('role', "role is invalid").exists().notEmpty().trim().isIn(['ADMIN', 'VIEWER']),

], showValidationError, errorHandler, controllerAdmins.postEditAdminDetails) ;


router.post('/admins/edit/save-password', isAuthenticatedPostRequest, [
  body('password', "Password is invalid").exists().notEmpty().isLength({min:12}).trim(),
  body('passwordAgain', "Password Again is invalid").exists().notEmpty().custom((value, {req})=>{
    return value == req.body.password ;
  }),
], showValidationError, errorHandler, controllerAdmins.postEditAdminPassword) ;


router.post('/admins/delete', isAuthenticatedPostRequest, [
  body('adminId', "Invalid AdminId").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
], showValidationError, errorHandler, controllerAdmins.postDeletePage) ;


module.exports = router ;