const express = require('express') ;
const controllerOrders = require('../controllers/orders') ;
const {body, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const showValidationError = validationMiddleware.showValidationError ;


router.get('/orders', controllerOrders.getOrderPage) ;


router.post('/orders/operation', [
  body('id', "Invalid Order Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('operation', "Invalid Order operation").exists().notEmpty().trim().escape().isIn(['accept', 'complete', 'cancel']),
], showValidationError, controllerOrders.postOrderOperation) ;


module.exports = router ;