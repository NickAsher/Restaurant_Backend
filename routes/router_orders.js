const express = require('express') ;
const controllerOrders = require('../controllers/orders') ;
const {body, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

let errorBackPageLink = "/orders" ;

const showValidationError = validationMiddleware.showValidationError(errorBackPageLink) ;
const errorHandler = validationMiddleware.myErrorHandler(errorBackPageLink) ;
const isAuthenticated = authenticationMiddleware.isAuthenticated('orders') ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;

router.get('/orders', isAuthenticated, errorHandler, controllerOrders.getOrderPage) ;

router.post('/orders/operation', isAuthenticatedPostRequest, [
  body('id', "Invalid Order Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('operation', "Invalid Order operation").exists().notEmpty().trim().escape().isIn(['accept', 'complete', 'cancel']),
], showValidationError, errorHandler, controllerOrders.postOrderOperation) ;


module.exports = router ;