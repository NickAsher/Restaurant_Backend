const express = require('express') ;
const controllerSettings = require('../controllers/settings') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/settings" ;

const isAuthenticated = authenticationMiddleware.isAuthenticated('settings') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;

router.get('/settings', isAuthenticated, controllerSettings.getSettingsPage) ;

router.post('/settings/delete-images', isAuthenticatedPostRequest, controllerSettings.postDeletePublicImages) ;


module.exports =router ;