const express = require('express') ;
const controllerGallery = require('../controllers/gallery') ;
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


router.get('/gallery', controllerGallery.getAllGalleryItemPage) ;
router.get('/gallery/add', controllerGallery.getAddGalleryItemPage) ;
router.post('/gallery/add/save', upload.single('post_Image'), controllerGallery.postAddGalleryItemPage) ;
router.post('/gallery/delete',  controllerGallery.postDeleteGalleryItemPage) ;
router.get('/gallery/arrange', controllerGallery.getArrangeGalleryItemsPage) ;
router.post('/gallery/arrange',  controllerGallery.postArrangeGalleryItemsPage) ;


module.exports = router ;