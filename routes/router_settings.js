const express = require('express') ;
const controllerSettings = require('../controllers/settings') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/settings" ;

const isAuthenticated = authenticationMiddleware.isAuthenticated('settings') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;
const hasMinPermissionLevel_Owner = authenticationMiddleware.hasMinPermissionLevel_Owner ;

router.get('/settings', isAuthenticated, hasMinPermissionLevel_Owner, controllerSettings.getSettingsPage) ;

router.post('/settings/delete-images', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner,
  controllerSettings.postDeletePublicImages) ;

router.post('/settings/restore-images', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner,
  controllerSettings.postRestorePublicImages) ;

router.post('/settings/truncate-tables', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner,
  controllerSettings.postTruncateTables) ;

router.post('/settings/restore-tables', isAuthenticatedPostRequest, hasMinPermissionLevel_Owner,
  controllerSettings.postRestoreTables) ;


module.exports =router ;