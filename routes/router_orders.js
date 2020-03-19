const express = require('express') ;
const controllerOrders = require('../controllers/orders') ;
const {body, validationResult} = require('express-validator') ;
const multer = require('multer') ;

const router = express.Router() ;

let multerStorage = multer.diskStorage({
  destination : function(req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    let newFileName = Date.now() + "_" + file.originalname ;
    req.myFileName = newFileName ; // adding the newly created filename to my request
    cb(null , newFileName);
  }
}) ;
let upload = multer({storage : multerStorage}) ;


const showValidationError = (req, res, next)=>{
  const errors = validationResult(req) ;

  if (!errors.isEmpty()) {
    return res.status(422).send({
      status:false,
      error : errors.array()
    });
  } else {
    next() ;
  }
} ;


router.get('/orders', controllerOrders.getOrderPage) ;
router.post('/orders/operation', controllerOrders.postOrderOperation) ;


module.exports = router ;