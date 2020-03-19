const express = require('express') ;
const controllerMenu = require('../controllers/menu') ;
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


router.get('/menu/category', controllerMenu.getAllCategoryPage) ;
router.get('/menu/category/view/:categoryId', controllerMenu.getViewCategoryPage) ;
router.get('/menu/category/edit/:categoryId', controllerMenu.getEditCategoryPage) ;
router.post('/menu/category/edit/save', upload.single('post_Image'), controllerMenu.postEditCategoryPage) ;
router.get('/menu/category/add', controllerMenu.getAddCategoryPage) ;
router.post('/menu/category/add/save', upload.single('post_Image'), controllerMenu.postAddCategoryPage) ;
router.post('/menu/category/delete', controllerMenu.postDeleteCategoryPage) ;
router.post('/menu/category/arrange', controllerMenu.postArrangeCategoryPage) ;
router.get('/menu/category/arrange', controllerMenu.getArrangeCategoryPage) ;

router.get('/menu/dishes', controllerMenu.getAllDishesPage) ;
router.get('/menu/dishes/view/:menuItemId', controllerMenu.getViewDishPage) ;
router.get('/menu/dishes/edit/:menuItemId', controllerMenu.getEditDishPage) ;
router.post('/menu/dishes/edit/save', upload.single('post_Image'), controllerMenu.postEditDishPage) ;
router.get('/menu/dishes/add/:categoryId', controllerMenu.getAddDishPage) ;
router.post('/menu/dishes/add/save', upload.single('post_Image'), controllerMenu.postAddDishPage) ;
router.post('/menu/dishes/delete', upload.none(), controllerMenu.postDeleteDishPage ) ;
router.get('/menu/dishes/arrange/:categoryId', controllerMenu.getArrangeDishesPage) ;
router.post('/menu/dishes/arrange/', upload.none(), controllerMenu.postArrangeDishesPage) ;


router.get('/menu/addons', controllerMenu.getAllAddonItemsPage) ;
router.get('/menu/addons/view/:addonItemId', controllerMenu.getViewAddonPage) ;
router.get('/menu/addons/edit/:addonItemId', controllerMenu.getEditAddonPage) ;
router.post('/menu/addons/edit/save', upload.none(), controllerMenu.postEditAddonPage) ;
router.get('/menu/addons/add/:categoryId/:addonGroupId', controllerMenu.getAddAddonPage) ;
router.post('/menu/addons/add/save', upload.none(), controllerMenu.postAddAddonPage) ;
router.post('/menu/addons/delete', upload.none(), controllerMenu.postDeleteAddonPage ) ;
router.get('/menu/addons/arrange/:addonGroupId', controllerMenu.getArrangeAddonsPage) ;
router.post('/menu/addons/arrange/', upload.none(), controllerMenu.postArrangeAddonsPage) ;
router.get('/menu/addons/change-default/:addonGroupId', controllerMenu.getChangeDefaultAddonPage) ;
router.post('/menu/addons/change-default/save', upload.none(), controllerMenu.postChangeDefaultAddonPage) ;


router.get('/menu/size/:categoryId', controllerMenu.getAllSizesPage) ;
router.get('/menu/size/edit/:sizeId', controllerMenu.getEditSizePage) ;
router.post('/menu/size/edit/save', controllerMenu.postEditSizePage) ;
router.get('/menu/size/add/:categoryId', controllerMenu.getAddSizePage) ;
router.post('/menu/size/add/save', controllerMenu.postAddSizePage) ;
router.post('/menu/size/delete', controllerMenu.postDeleteSizePage);
router.get('/menu/size/arrange/:categoryId', controllerMenu.getArrangeSizesPage) ;
router.post('/menu/size/arrange/save', controllerMenu.postArrangeSizesPage) ;
router.get('/menu/size/change-default/:categoryId', controllerMenu.getChangeDefaultSizePage) ;
router.post('/menu/size/change-default/save', controllerMenu.postChangeDefaultSizePage) ;


router.get('/menu/addonGroup/:categoryId', controllerMenu.getAllAddonGroupsPage) ;
router.get('/menu/addonGroup/edit/:addonGroupId', controllerMenu.getEditAddonGroupPage) ;
router.post('/menu/addonGroup/edit/save', controllerMenu.postEditAddonGroupPage) ;
router.get('/menu/addonGroup/add/:categoryId', controllerMenu.getAddAddonGroupPage) ;
router.post('/menu/addonGroup/add/save', controllerMenu.postAddAddonGroupPage) ;
router.post('/menu/addonGroup/delete', controllerMenu.postDeleteAddonGroupPage);
router.get('/menu/addonGroup/arrange/:categoryId', controllerMenu.getArrangeAddonGroupPage) ;
router.post('/menu/addonGroup/arrange/save', controllerMenu.postArrangeAddonGroupPage) ;


module.exports = router ;