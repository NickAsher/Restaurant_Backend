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
const hasMinPermissionLevel_Owner = authenticationMiddleware.hasMinPermissionLevel_Owner ;



router.get('/admins', isAuthenticated, hasMinPermissionLevel_Owner, errorHandler, controllerAdmins.getAllAdminsPage) ;

router.get('/admins/add', isAuthenticated, hasMinPermissionLevel_Owner, errorHandler, controllerAdmins.getAddNewAdminPage) ;

router.post('/admins/add/save', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner, [
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


router.get('/admins/edit/:adminId', isAuthenticated, hasMinPermissionLevel_Owner, errorHandler, controllerAdmins.getEditAdminPage) ;


router.post('/admins/edit/save-details', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner, [
  body('fullname', "Fullname is invalid").exists().notEmpty().trim().escape(),
  body('email', "Email  is invalid").exists().notEmpty().isEmail().trim().normalizeEmail(),
  body('isAccountActive', "isAccountAcitve is invalid").exists().notEmpty().isBoolean(),
  body('validUntill', "validUntill is invalid").exists().notEmpty().trim().escape(), //TODO check if it is a valid datetime
  body('role', "role is invalid").exists().notEmpty().trim().isIn(['ADMIN', 'VIEWER']),

], showValidationError, errorHandler, controllerAdmins.postEditAdminDetails) ;


router.post('/admins/edit/save-password', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner, [
  body('password', "Password is invalid").exists().notEmpty().isLength({min:12}).trim(),
  body('passwordAgain', "Password Again is invalid").exists().notEmpty().custom((value, {req})=>{
    return value == req.body.password ;
  }),
], showValidationError, errorHandler, controllerAdmins.postEditAdminPassword) ;


router.post('/admins/delete', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner, [
  body('adminId', "Invalid AdminId").exists().notEmpty().isNumeric({no_symbols:true}).trim(),
], showValidationError, errorHandler, controllerAdmins.postDeletePage) ;


module.exports = router ;