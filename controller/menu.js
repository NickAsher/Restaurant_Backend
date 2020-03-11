const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const fs = require('fs') ;

exports.getAllCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/all_categories.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getViewCategoryPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/view_single_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getEditCategoryPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/edit_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postEditCategoryPage = async (req,res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let categoryIsActive = req.body.isCategoryActive == 'true' ? true : false ; //converting from string to boolean
    let categoryName = req.body.categoryName ;
    let dbData ;
    if(!req.file){
      // no image is uploaded, so keep the existing image and just change the data
      dbData = await dbConnection.execute(`
        UPDATE menu_meta_category_table SET category_name = :categoryName, category_is_active = :categoryIsActive 
        WHERE category_id = :categoryId `, {
        categoryName,
        categoryIsActive,
        categoryId
      }) ;
    } else{
      // an image was uploaded, so firstly delete the previous image and then change db entries
      let oldImageFileName = req.body.categoryOldImageFileName ;
      let newImageFileName = req.myFileName ;

      fs.unlinkSync(Constants.IMAGE_PATH + oldImageFileName) ;
      dbData = await dbConnection.execute(`
        UPDATE menu_meta_category_table 
        SET category_name = :categoryName, category_is_active = :categoryIsActive, category_image = :newImageFileName 
        WHERE category_id = :categoryId `, {
        categoryName,
        categoryIsActive,
        newImageFileName,
        categoryId
      }) ;
    }

    res.send({
      dbData,
      link : "http://localhost:3002/menu/category"

    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getArrangeCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/arrange_category.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postArrangeCategoryPage = async (req,res)=>{
  try{
    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE menu_meta_category_table SET category_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is category_id
      sqlCaseString += ` WHEN category_id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += " END" ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;
