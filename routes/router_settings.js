const express = require('express') ;
const controllerSettings = require('../controllers/settings') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/settings" ;

const isAuthenticated = authenticationMiddleware.isAuthenticated('blogs') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;

router.get('/settings', controllerSettings.getSettingsPage) ;



module.exports =router ;