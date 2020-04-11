const express = require('express') ;
const controllerSettings = require('../controllers/settings') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/settings" ;

const isAuthenticated = authenticationMiddleware.isAuthenticated('settings') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;

router.get('/settings', isAuthenticated, controllerSettings.getSettingsPage) ;

router.post('/settings/delete-images', isAuthenticatedPostRequest, controllerSettings.postDeletePublicImages) ;

router.post('/settings/restore-images', isAuthenticatedPostRequest, controllerSettings.postRestorePublicImages) ;

router.post('/settings/truncate-tables', isAuthenticatedPostRequest, controllerSettings.postTruncateTables) ;

router.post('/settings/restore-tables', isAuthenticatedPostRequest, controllerSettings.postRestoreTables) ;


module.exports =router ;