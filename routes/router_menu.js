const express = require('express') ;
const controllerMenu = require('../controllers/menu') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded ;


router.get('/menu/category', controllerMenu.getAllCategoryPage) ;

router.get('/menu/category/view/:categoryId', [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getViewCategoryPage) ;

router.get('/menu/category/edit/:categoryId', [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getEditCategoryPage) ;

router.post('/menu/category/edit/save', upload.single('post_Image'), checkFileMagicNumber, [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('isCategoryActive', "Invalid boolean isCategoryActive Name").exists().notEmpty().isBoolean(),
  body('categoryName', "Invalid Category Name").exists().notEmpty().trim().escape(),
], showValidationError, controllerMenu.postEditCategoryPage) ;

router.get('/menu/category/add', controllerMenu.getAddCategoryPage) ;

router.post('/menu/category/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, [
  body('isCategoryActive', "Invalid boolean isCategoryActive Name").exists().notEmpty().isBoolean(),
  body('categoryName', "Invalid Category Name").exists().notEmpty().trim().escape(),
], showValidationError, controllerMenu.postAddCategoryPage) ;

router.post('/menu/category/delete', [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('categoryImageFileName', "Invalid Category Image Name").exists().notEmpty().trim(),
], showValidationError, controllerMenu.postDeleteCategoryPage) ;

router.post('/menu/category/arrange', controllerMenu.postArrangeCategoryPage) ;

router.get('/menu/category/arrange', [
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a foreach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError, controllerMenu.getArrangeCategoryPage) ;

/********************************************************************************************/
/******************************************** Menu Dishes ***********************************/
/********************************************************************************************/

router.get('/menu/dishes', controllerMenu.getAllDishesPage) ;

router.get('/menu/dishes/view/:menuItemId', [
  param('menuItemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getViewDishPage) ;

router.get('/menu/dishes/edit/:menuItemId', [
  param('menuItemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getEditDishPage) ;

//TODO validate the size price
router.post('/menu/dishes/edit/save', upload.single('post_Image'), checkFileMagicNumber, [
  body('itemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('isItemActive', "Invalid boolean isItemActive ").exists().notEmpty().isBoolean(),
  body('itemName', "Invalid DishItem Name").exists().notEmpty().trim().escape(),
  body('itemDescription', "Invalid DishItem Description").exists().notEmpty().trim().escape(),
], showValidationError, controllerMenu.postEditDishPage) ;

router.get('/menu/dishes/add/:categoryId', [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getAddDishPage) ;

//TODO validate the size price
router.post('/menu/dishes/add/save', upload.single('post_Image'), checkFileIsUploaded, checkFileMagicNumber, [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('isItemActive', "Invalid boolean isItemActive ").exists().notEmpty().isBoolean(),
  body('itemName', "Invalid DishItem Name").exists().notEmpty().trim().escape(),
  body('itemDescription', "Invalid DishItem Description").exists().notEmpty().trim().escape(),
], showValidationError,  controllerMenu.postAddDishPage) ;

router.post('/menu/dishes/delete', [
  body('itemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemImageName', 'Invalid Image File Name').exists().notEmpty().trim(),
], showValidationError, controllerMenu.postDeleteDishPage ) ;

router.get('/menu/dishes/arrange/:categoryId', [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getArrangeDishesPage) ;

router.post('/menu/dishes/arrange/save', [
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a foreach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError, controllerMenu.postArrangeDishesPage) ;


/********************************************************************************************/
/******************************************** Addons ***********************************/
/********************************************************************************************/

router.get('/menu/addons', controllerMenu.getAllAddonItemsPage) ;

router.get('/menu/addons/view/:addonItemId', [
  param('addonItemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getViewAddonPage) ;

router.get('/menu/addons/edit/:addonItemId', [
  param('addonItemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getEditAddonPage) ;

//TODO validate the size price data
router.post('/menu/addons/edit/save', [
  body('itemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemName').exists().notEmpty().trim().escape(),
  body('isItemActive').exists().notEmpty().isBoolean(),

], showValidationError, controllerMenu.postEditAddonPage) ;

router.get('/menu/addons/add/:categoryId/:addonGroupId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getAddAddonPage) ;

//TODO validate the size price data
router.post('/menu/addons/add/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemName').exists().notEmpty().trim().escape(),
  body('isItemActive').exists().notEmpty().isBoolean(),
], showValidationError, controllerMenu.postAddAddonPage) ;

router.post('/menu/addons/delete',  [
  body('itemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.postDeleteAddonPage ) ;

router.get('/menu/addons/arrange/:addonGroupId', [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getArrangeAddonsPage) ;

router.post('/menu/addons/arrange/', [
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a foreach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError, controllerMenu.postArrangeAddonsPage) ;

router.get('/menu/addons/change-default/:addonGroupId', [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getChangeDefaultAddonPage) ;

router.post('/menu/addons/change-default/save',  [
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('defaultItemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.postChangeDefaultAddonPage) ;


/********************************************************************************************/
/******************************************** Size ***********************************/
/********************************************************************************************/


router.get('/menu/size/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getAllSizesPage) ;

router.get('/menu/size/edit/:sizeId', [
  param('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.getEditSizePage) ;

router.post('/menu/size/edit/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeName').exists().notEmpty().trim().escape(),
  body('isSizeActive').exists().notEmpty().isBoolean(),
  body('sizeNameAbbreviated').exists().notEmpty().trim().escape(),
], showValidationError,  controllerMenu.postEditSizePage) ;

router.get('/menu/size/add/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.getAddSizePage) ;

router.post('/menu/size/add/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeName').exists().notEmpty().trim().escape(),
  body('isSizeActive').exists().notEmpty().isBoolean(),
  body('sizeNameAbbreviated').exists().notEmpty().trim().escape(),
], showValidationError,  controllerMenu.postAddSizePage) ;

router.post('/menu/size/delete', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.postDeleteSizePage);

router.get('/menu/size/arrange/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.getArrangeSizesPage) ;

router.post('/menu/size/arrange/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a foreach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError,  controllerMenu.postArrangeSizesPage) ;

router.get('/menu/size/change-default/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.getChangeDefaultSizePage) ;

router.post('/menu/size/change-default/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('defaultSizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError,  controllerMenu.postChangeDefaultSizePage) ;

/********************************************************************************************/
/******************************************** Addon-Group ***********************************/
/********************************************************************************************/

router.get('/menu/addonGroup/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getAllAddonGroupsPage) ;

router.get('/menu/addonGroup/edit/:addonGroupId', [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getEditAddonGroupPage) ;

router.post('/menu/addonGroup/edit/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupName').exists().notEmpty().trim().escape(),
  body('addonGroupType').exists().notEmpty().trim().escape().isIn(['radio', 'checkbox']),
  body('isAddonGroupActive').exists().notEmpty().isBoolean(),
], showValidationError, controllerMenu.postEditAddonGroupPage) ;

router.get('/menu/addonGroup/add/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getAddAddonGroupPage) ;

router.post('/menu/addonGroup/add/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupName').exists().notEmpty().trim().escape(),
  body('addonGroupType').exists().notEmpty().trim().escape().isIn(['radio', 'checkbox']),
  body('isAddonGroupActive').exists().notEmpty().isBoolean(),
], showValidationError, controllerMenu.postAddAddonGroupPage) ;

router.post('/menu/addonGroup/delete', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.postDeleteAddonGroupPage);

router.get('/menu/addonGroup/arrange/:categoryId', [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError, controllerMenu.getArrangeAddonGroupPage) ;

router.post('/menu/addonGroup/arrange/save', [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sortedArray', "Invalid array of Id's").exists().notEmpty().custom((value, {req})=>{
    // we have to return a boolean in this function
    let sortedArray = JSON.parse(value) ;
    if(!Array.isArray(sortedArray)){
      return false ;
    }
    for(let i=0;i<sortedArray.length;i++){
      /* check that each element is a valid integer id ;
       * if it is not, return false, else go on.
       * we are not using a foreach loop because if we return something inside foreach loop,
       * it is only returned inside that iteration
       */
      if(/^\+?\d+$/.test(sortedArray[i]) === false){
        return false ;
      }
    }

    return true ;
  })
], showValidationError, controllerMenu.postArrangeAddonGroupPage) ;



module.exports = router ;