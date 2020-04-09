const express = require('express') ;
const controllerMenu = require('../controllers/menu') ;
const {body, param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;

const router = express.Router() ;

const upload = validationMiddleware.upload ;
const checkFileMagicNumber = validationMiddleware.checkFileMagicNumber ;
const showValidationError = validationMiddleware.showValidationError ;
const checkFileIsUploaded = validationMiddleware.checkFileIsUploaded ;
const isAuthenticated = authenticationMiddleware.isAuthenticated ;
const isAuthenticatedPostRequest = authenticationMiddleware.isAuthenticatedPostRequest ;


let errorBackPageLink_Category = "/menu/category" ;

router.get('/menu/category', isAuthenticated('menu/category'),  controllerMenu.getAllCategoryPage) ;

router.get('/menu/category/view/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getViewCategoryPage) ;

router.get('/menu/category/edit/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getEditCategoryPage) ;

router.post('/menu/category/edit/save', isAuthenticatedPostRequest, upload.single('post_Image'), checkFileMagicNumber, [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('isCategoryActive', "Invalid boolean isCategoryActive Name").exists().notEmpty().isBoolean(),
  body('categoryName', "Invalid Category Name").exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postEditCategoryPage) ;

router.get('/menu/category/add', isAuthenticated('menu/category'), controllerMenu.getAddCategoryPage) ;

router.post('/menu/category/add/save', isAuthenticatedPostRequest, upload.single('post_Image'), checkFileIsUploaded(errorBackPageLink_Category), checkFileMagicNumber, [
  body('isCategoryActive', "Invalid boolean isCategoryActive Name").exists().notEmpty().isBoolean(),
  body('categoryName', "Invalid Category Name").exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postAddCategoryPage) ;

router.post('/menu/category/delete', isAuthenticatedPostRequest, [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols:true}).trim().escape(),
  body('categoryImageFileName', "Invalid Category Image Name").exists().notEmpty().trim(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postDeleteCategoryPage) ;

router.get('/menu/category/arrange', isAuthenticated('menu/category'), controllerMenu.getArrangeCategoryPage) ;

router.post('/menu/category/arrange', isAuthenticatedPostRequest, [
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
], showValidationError(errorBackPageLink_Category), controllerMenu.postArrangeCategoryPage) ;

/********************************************************************************************/
/******************************************** Menu Dishes ***********************************/
/********************************************************************************************/

let errorBackPageLink_Dishes = "/menu/dishes" ;

router.get('/menu', (req, res)=>{
  res.redirect('/menu/dishes') ;
}) ;


router.get('/menu/dishes', isAuthenticated('menu/dishes'), controllerMenu.getAllDishesPage) ;

router.get('/menu/dishes/view/:menuItemId', isAuthenticated('menu/dishes'), [
  param('menuItemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.getViewDishPage) ;

router.get('/menu/dishes/edit/:menuItemId', isAuthenticated('menu/dishes'), [
  param('menuItemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.getEditDishPage) ;

router.post('/menu/dishes/edit/save', isAuthenticatedPostRequest, upload.single('post_Image'), checkFileMagicNumber, [
  body('itemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('isItemActive', "Invalid boolean isItemActive ").exists().notEmpty().isBoolean(),
  body('itemName', "Invalid DishItem Name").exists().notEmpty().trim().escape(),
  body('itemDescription', "Invalid DishItem Description").exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.postEditDishPage) ;

router.get('/menu/dishes/add/:categoryId', isAuthenticated('menu/dishes'), [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.getAddDishPage) ;

router.post('/menu/dishes/add/save', isAuthenticatedPostRequest, upload.single('post_Image'), checkFileIsUploaded(errorBackPageLink_Dishes), checkFileMagicNumber, [
  body('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('isItemActive', "Invalid boolean isItemActive ").exists().notEmpty().isBoolean(),
  body('itemName', "Invalid DishItem Name").exists().notEmpty().trim().escape(),
  body('itemDescription', "Invalid DishItem Description").exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Dishes),  controllerMenu.postAddDishPage) ;

router.post('/menu/dishes/delete', isAuthenticatedPostRequest, [
  body('itemId', "Invalid MenuItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemImageName', 'Invalid Image File Name').exists().notEmpty().trim(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.postDeleteDishPage ) ;

router.get('/menu/dishes/arrange/:categoryId', isAuthenticated('menu/dishes'), [
  param('categoryId', "Invalid Category Id").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Dishes), controllerMenu.getArrangeDishesPage) ;

router.post('/menu/dishes/arrange/save', isAuthenticatedPostRequest, [
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
], showValidationError(errorBackPageLink_Dishes), controllerMenu.postArrangeDishesPage) ;


/********************************************************************************************/
/******************************************** Addons ***********************************/
/********************************************************************************************/

let errorBackPageLink_Addons = "/menu/addons" ;

router.get('/menu/addons', isAuthenticated('menu/addons'), controllerMenu.getAllAddonItemsPage) ;

router.get('/menu/addons/view/:addonItemId', isAuthenticated('menu/addons'), [
  param('addonItemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.getViewAddonPage) ;

router.get('/menu/addons/edit/:addonItemId', isAuthenticated('menu/addons'), [
  param('addonItemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.getEditAddonPage) ;

router.post('/menu/addons/edit/save', isAuthenticatedPostRequest, [
  body('itemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemName').exists().notEmpty().trim().escape(),
  body('isItemActive').exists().notEmpty().isBoolean(),

], showValidationError(errorBackPageLink_Addons), controllerMenu.postEditAddonPage) ;

router.get('/menu/addons/add/:categoryId/:addonGroupId', isAuthenticated('menu/addons'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.getAddAddonPage) ;

router.post('/menu/addons/add/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('itemName').exists().notEmpty().trim().escape(),
  body('isItemActive').exists().notEmpty().isBoolean(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.postAddAddonPage) ;

router.post('/menu/addons/delete', isAuthenticatedPostRequest, [
  body('itemId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.postDeleteAddonPage ) ;

router.get('/menu/addons/arrange/:addonGroupId', isAuthenticated('menu/addons'), [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.getArrangeAddonsPage) ;

router.post('/menu/addons/arrange/', isAuthenticatedPostRequest, [
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
], showValidationError(errorBackPageLink_Addons), controllerMenu.postArrangeAddonsPage) ;

router.get('/menu/addons/change-default/:addonGroupId', isAuthenticated('menu/addons'), [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.getChangeDefaultAddonPage) ;

router.post('/menu/addons/change-default/save', isAuthenticatedPostRequest, [
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('defaultItemId').exists().notEmpty().isNumeric({no_symbols: false}).trim().escape(),
], showValidationError(errorBackPageLink_Addons), controllerMenu.postChangeDefaultAddonPage) ;


/********************************************************************************************/
/******************************************** Size ***********************************/
/********************************************************************************************/


router.get('/menu/size/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getAllSizesPage) ;

router.get('/menu/size/edit/:sizeId', isAuthenticated('menu/category'), [
  param('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.getEditSizePage) ;

router.post('/menu/size/edit/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeName').exists().notEmpty().trim().escape(),
  body('isSizeActive').exists().notEmpty().isBoolean(),
  body('sizeNameAbbreviated').exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.postEditSizePage) ;

router.get('/menu/size/add/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.getAddSizePage) ;

router.post('/menu/size/add/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeName').exists().notEmpty().trim().escape(),
  body('isSizeActive').exists().notEmpty().isBoolean(),
  body('sizeNameAbbreviated').exists().notEmpty().trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.postAddSizePage) ;

router.post('/menu/size/delete', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('sizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.postDeleteSizePage);

router.get('/menu/size/arrange/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.getArrangeSizesPage) ;

router.post('/menu/size/arrange/save', isAuthenticatedPostRequest, [
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
], showValidationError(errorBackPageLink_Category),  controllerMenu.postArrangeSizesPage) ;

router.get('/menu/size/change-default/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.getChangeDefaultSizePage) ;

router.post('/menu/size/change-default/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('defaultSizeId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category),  controllerMenu.postChangeDefaultSizePage) ;

/********************************************************************************************/
/******************************************** Addon-Group ***********************************/
/********************************************************************************************/

router.get('/menu/addonGroup/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getAllAddonGroupsPage) ;

router.get('/menu/addonGroup/edit/:addonGroupId', isAuthenticated('menu/category'), [
  param('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getEditAddonGroupPage) ;

router.post('/menu/addonGroup/edit/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupName').exists().notEmpty().trim().escape(),
  body('addonGroupType').exists().notEmpty().trim().escape().isIn(['radio', 'checkbox']),
  body('isAddonGroupActive').exists().notEmpty().isBoolean(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postEditAddonGroupPage) ;

router.get('/menu/addonGroup/add/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getAddAddonGroupPage) ;

router.post('/menu/addonGroup/add/save', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupName').exists().notEmpty().trim().escape(),
  body('addonGroupType').exists().notEmpty().trim().escape().isIn(['radio', 'checkbox']),
  body('isAddonGroupActive').exists().notEmpty().isBoolean(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postAddAddonGroupPage) ;

router.post('/menu/addonGroup/delete', isAuthenticatedPostRequest, [
  body('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  body('addonGroupId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.postDeleteAddonGroupPage);

router.get('/menu/addonGroup/arrange/:categoryId', isAuthenticated('menu/category'), [
  param('categoryId').exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
], showValidationError(errorBackPageLink_Category), controllerMenu.getArrangeAddonGroupPage) ;

router.post('/menu/addonGroup/arrange/save', isAuthenticatedPostRequest, [
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
], showValidationError(errorBackPageLink_Category), controllerMenu.postArrangeAddonGroupPage) ;



module.exports = router ;