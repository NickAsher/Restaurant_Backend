const express = require('express') ;
const controllerInfo = require('../controllers/info') ;
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


router.get('/about', controllerInfo.getAboutPage) ;
router.get('/about/edit', controllerInfo.getAboutEditPage) ;
router.post('/about/edit/save', controllerInfo.postAboutEditPage) ;
router.get('/contact', controllerInfo.getContactPage) ;
router.get('/contact/edit', controllerInfo.getContactEditPage) ;
router.post('/contact/edit/save', controllerInfo.postContactEditPage) ;


module.exports = router ;