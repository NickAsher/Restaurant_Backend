const express = require('express') ;
const controllerOfferSpecial = require('../controllers/offers') ;
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


router.get('/specials', controllerOfferSpecial.getAllOfferSpecials) ;
router.get('/specials/arrange', controllerOfferSpecial.getArrangeOfferSpecialsPage) ;
router.post('/specials/arrange', controllerOfferSpecial.postOfferSpecialsPage) ;
router.get('/specials/add', controllerOfferSpecial.getAddOfferSpecial) ;
router.post('/specials/add/save', upload.single('post_Image'), controllerOfferSpecial.postAddOfferSpecial) ;
router.post('/specials/delete',  controllerOfferSpecial.postDeleteOfferSpecial) ;
router.get('/specials/:offerId', controllerOfferSpecial.getSingleOfferSpecial) ;
router.get('/specials/:offerId/edit', controllerOfferSpecial.getEditOfferSpecial) ;
router.post('/specials/edit/save', upload.single('post_Image'), controllerOfferSpecial.postEditOfferSpecial) ;



module.exports = router ;