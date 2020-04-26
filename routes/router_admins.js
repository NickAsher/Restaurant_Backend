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


module.exports = router ;