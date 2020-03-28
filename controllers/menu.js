const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const fs = require('fs') ;
const logger = require('../middleware/logging') ;

exports.getAllCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData ;}

    let categoryData = dbData.data ;

    res.render('menu/category/all_categories.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getViewCategoryPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbData.status != true){throw dbData ;}

    let categoryData = dbData.data ;

    res.render('menu/category/view_single_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.getEditCategoryPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbData.status != true){throw dbData ;}

    let categoryData = dbData.data ;

    res.render('menu/category/edit_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.postEditCategoryPage = async (req,res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let categoryIsActive = req.body.isCategoryActive ; //converting from string to boolean
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

    res.redirect(`/menu/category/view/${categoryId}`) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.getAddCategoryPage = async (req, res)=>{
  try{
    res.render('menu/category/add_category.hbs') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.postAddCategoryPage = async (req, res)=>{
  try{
    let categoryName = req.body.categoryName ;
    let categoryIsActive = req.body.isCategoryActive ;
    let newImageFileName = req.myFileName ;

    let dbData = await dbConnection.execute(
      `INSERT INTO menu_meta_category_table (category_sr_no, category_name, category_is_active, category_image) 
      SELECT COALESCE( (MAX( category_sr_no ) + 1), 1) , :categoryName , :categoryIsActive , :newImageFileName 
      FROM menu_meta_category_table `, {
        categoryName,
        categoryIsActive,
        newImageFileName,
    }) ;




    res.redirect('/menu/category') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.postDeleteCategoryPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let categoryImageFileName = req.body.categoryImageFileName ;

    let dbMenuItems = await dbRepository.getAllMenuItemsInCategory(categoryId) ;
    if(dbMenuItems.status != true){throw dbMenuItems ;}

    let menuItemsList = dbMenuItems.data ;
    menuItemsList.forEach((menuItem)=>{
      fs.unlinkSync(Constants.IMAGE_PATH + menuItem.item_image_name) ;
    }) ;

    fs.unlinkSync(Constants.IMAGE_PATH + categoryImageFileName) ;

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbCategoryTable = await explicitConnection.execute(
      `DELETE FROM menu_meta_category_table WHERE category_id = :categoryId`,{
      categoryId
    }) ;

    let dbDishesTable = await explicitConnection.execute(
      `DELETE FROM menu_items_table WHERE item_category_id = :categoryId`,{
        categoryId
      }) ;

    let dbAddonTable = await explicitConnection.execute(
      `DELETE FROM menu_addons_table WHERE item_category_id = :categoryId`,{
        categoryId
      }) ;

    let dbDishesSizePriceTable = await explicitConnection.execute(
      `DELETE FROM menu_meta_rel_size_items_table WHERE item_category_id = :categoryId`,{
        categoryId
      }) ;

    let dbAddonSizePriceTable = await explicitConnection.execute(
      `DELETE FROM menu_meta_rel_size_addons_table WHERE category_id = :categoryId`,{
        categoryId
      }) ;

    let dbSizeTable = await explicitConnection.execute(
      `DELETE FROM menu_meta_size_table WHERE size_category_id = :categoryId`,{
        categoryId
      }) ;

    let dbAddonGroupTable = await explicitConnection.execute(
      `DELETE FROM menu_meta_addongroups_table WHERE category_id = :categoryId`,{
        categoryId
      }) ;

    await explicitConnection.commit() ;


    res.redirect('/menu/category') ;



  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }

} ;


exports.getArrangeCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData ;}

    let categoryData = dbData.data ;

    res.render('menu/category/arrange_category.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
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
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;





/************************************************** Dishes **************************************************** */


exports.getAllDishesPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;
    if(dbData.status != true){throw dbData ;}

    let menuData = dbData.data ;
    res.render('menu/dishes/all_dishes.hbs', {
      status : true,
      menuData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getViewDishPage = async (req, res)=>{
  try{
    let menuItemId = req.params.menuItemId ;

    let dbItemData = await dbRepository.getSingleMenuItem(menuItemId) ;
    if(dbItemData.status != true){throw dbItemData ;}

    let dbItemSizePriceData = await dbRepository.getSingleMenuItem_PriceData(menuItemId) ;
    if(dbItemSizePriceData.status != true){throw dbItemSizePriceData ;}

    let itemData = dbItemData.data ;
    let itemSizePriceData = dbItemSizePriceData.data ;

    res.render('menu/dishes/view_single_dish.hbs', {
      itemData,
      itemSizePriceData
    }) ;
    // res.send({
    //   itemData,
    //   itemSizePriceData
    // }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.getEditDishPage = async (req, res)=>{
  try{
    let menuItemId = req.params.menuItemId ;

    let dbItemData = await dbRepository.getSingleMenuItem(menuItemId) ;
    if(dbItemData.status != true){throw dbItemData ;}

    let dbItemSizePriceData = await dbRepository.getSingleMenuItem_PriceData(menuItemId) ;
    if(dbItemSizePriceData.status != true){throw dbItemSizePriceData ;}

    let itemData = dbItemData.data ;
    let itemSizePriceData = dbItemSizePriceData.data ;

    res.render('menu/dishes/edit_single_dish.hbs', {
      itemData,
      itemSizePriceData
    }) ;
    // res.send({
    //   itemData,
    //   itemSizePriceData
    // }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.postEditDishPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let itemId = req.body.itemId ;
    let itemName = req.body.itemName ;
    let itemDescription = req.body.itemDescription ;
    let itemIsActive = req.body.isItemActive  ;

    //firstly let's validate the size price data
    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData ;}
    let sizeData = dbSizeData.data ;

    dbSizeData.data.forEach((element) => {
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`];
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`];

      if(isItemSizeActive == '1' || isItemSizeActive == '0'){
        // means it is a boolean
      }else{
        throw `Invalid value found for isItemSizeActive_${element.size_id}` ;
      }

      if(isNaN(itemSizePrice) || parseFloat(itemSizePrice) < 0){
        throw `Invalid value found for itemSizePrice_${element.size_id}` ;
      }
    });


    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;
    let dbItemData ;
    if(!req.file){
      // new image is not uploaded so simply update the db
      dbItemData = await explicitConnection.execute(`
        UPDATE menu_items_table 
        SET item_name = :itemName, item_description = :itemDescription, item_is_active = :itemIsActive
        WHERE item_id = :itemId `, {
          itemName,
          itemDescription,
          itemIsActive,
          itemId
      }) ;
    } else {
      let oldImageFileName = req.body.itemOldImageFileName ;
      let newImageFileName = req.myFileName ;
      fs.unlinkSync(Constants.IMAGE_PATH + oldImageFileName) ;

      dbItemData = await explicitConnection.execute(`
        UPDATE menu_items_table
        SET item_name = :itemName, item_description = :itemDescription, item_is_active = :itemIsActive, item_image_name = :newImageFileName
        WHERE item_id = :itemId `, {
          itemName,
        itemDescription,
        itemIsActive,
        itemId,
        newImageFileName
      }) ;
    }
    /*
     * now that  image and menu_items_table data is taken care of, let's update the price data
     * So from the form, the data for itemPrice is received like this
     * price data for a size is in form  req.body.itemSizePrice_sizeId
     *         sizeId=1 =>  req.body.itemSizePrice_1
     *         sizeId=2 =>  req.body.itemSizePrice_2
     *
     *   Similarly the isItemActive for a particular size is in  req.body.isItemSizeActive_sizeId
     *        for sizeId=1  => req.body.isItemSizeActive_1
     *        for sizeId=1  => req.body.isItemSizeActive_2
     *
     *  The sql statement uses two CASE statements. ex :
     *
     *  UPDATE `menu_meta_rel_size_items_table`
     *    SET `item_price` = CASE
     *        WHEN `size_id` = '1' THEN '99.0000'
     *        WHEN `size_id` = '2' THEN '194.0000'
     *        WHEN `size_id` = '3' THEN '394.0000'
     *    END,
     *    `item_size_active` = CASE
     *        WHEN `size_id` = '1' THEN true
     *        WHEN `size_id` = '2' THEN true
     *        WHEN `size_id` = '3' THEN true
     *    END
     *    WHERE `item_id` = '41001'
     */

    let sqlCaseString = 'UPDATE menu_meta_rel_size_items_table  SET item_price = CASE ' ;
    sizeData.forEach((element, index)=>{
      let newItemPriceForSize = req['body'][`itemSizePrice_${element.size_id}`] ;
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newItemPriceForSize} ` ;
    }) ;

    sqlCaseString += ' END, item_size_active = CASE ' ;
    sizeData.forEach((element, index)=>{
      let newIsItemActiveForSize = req['body'][`isItemSizeActive_${element.size_id}`] ;
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newIsItemActiveForSize} ` ;
    }) ;
    sqlCaseString += ` END WHERE item_id = ${itemId} ` ;
    let dbItemPriceData = await explicitConnection.execute(sqlCaseString) ;

    await explicitConnection.commit() ;

    res.redirect(`/menu/dishes/view/${itemId}`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.getAddDishPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbCategoryData.status != true){throw dbCategoryData ;}

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData ;}

    res.render('menu/dishes/add_new_dish.hbs', {
      categoryData : dbCategoryData.data,
      sizeData : dbSizeData.data
    }) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.postAddDishPage = async (req, res)=>{
  try{
    let itemName = req.body.itemName ;
    let itemDescription = req.body.itemDescription ;
    let isItemActive = req.body.isItemActive  ;
    let categoryId = req.body.categoryId ;

    let itemImageFileName = req.myFileName ;

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId) ;
    if(dbSizeData.status != true){throw dbSizeData ;}

    dbSizeData.data.forEach((element) => {
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`];
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`];

      if(isItemSizeActive == '1' || isItemSizeActive == '0'){
        // means it is a boolean
      }else{
        throw `Invalid value found for isItemSizeActive_${element.size_id}` ;
      }

      if(isNaN(itemSizePrice) || parseFloat(itemSizePrice) < 0){
        throw `Invalid value found for itemSizePrice_${element.size_id}` ;
      }
    });


    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbItemData = await explicitConnection.execute(`
      INSERT INTO menu_items_table 
      (item_sr_no, item_name, item_description, item_image_name, item_category_id, item_is_active )
      SELECT COALESCE( (MAX( item_sr_no ) + 1), 1) , :itemName, :itemDescription, :itemImageFileName, :categoryId, :isItemActive 
      FROM menu_items_table WHERE item_category_id = :categoryId `, {
      itemName,
      itemDescription,
      itemImageFileName,
      categoryId,
      isItemActive
    }) ;


    let itemInsertId = dbItemData[0].insertId ;

    let sqlInsertString = ` INSERT INTO menu_meta_rel_size_items_table 
      ( item_id, item_price, item_size_active, size_id, item_category_id) VALUES ` ;

    dbSizeData.data.forEach((element)=>{
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`] ;
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`] ;

      sqlInsertString += ` ( '${itemInsertId}', '${itemSizePrice}', '${isItemSizeActive}', '${element.size_id}', '${categoryId}' ), ` ;
    }) ;
    sqlInsertString = sqlInsertString.slice(0,-2) ;

    let dbSizeInsertData = await explicitConnection.execute(sqlInsertString) ;
    await explicitConnection.commit() ;
    res.redirect(`/menu/dishes`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.postDeleteDishPage = async (req, res)=>{
  try{
    let itemId = req.body.itemId ;
    let imageFileName = req.body.itemImageName ;

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbItemData = await explicitConnection.execute(`DELETE FROM menu_items_table WHERE item_id = :id `, {
      id : itemId
    }) ;

    let dbItemSizePriceData = await explicitConnection.execute(`DELETE FROM menu_meta_rel_size_items_table WHERE item_id = :id `, {
      id : itemId
    }) ;
    await explicitConnection.commit() ;

    res.redirect(`/menu/dishes`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.getArrangeDishesPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbItemData = await dbRepository.getAllMenuItemsInCategory(categoryId) ;
    if(dbItemData.status != true){throw dbItemData ;}

    let itemData = dbItemData.data ;
    res.render('menu/dishes/arrange_dishes.hbs',{
      categoryId,
      itemData
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/dishes",
      error : e
    }) ;
  }
} ;


exports.postArrangeDishesPage = async (req, res)=>{
  try{

    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE menu_items_table SET item_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is just the menuItemId
      sqlCaseString += ` WHEN item_id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += " END" ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


/* *********************************************** Addons ******************************************/
/* *********************************************** Addons ******************************************/
/* *********************************************** Addons ******************************************/

exports.getAllAddonItemsPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllAddonItems_Seperated() ;
    if(dbData.status != true){throw dbData ;}

    let addonData = dbData.data ;
    res.render('menu/addons/all_addons.hbs', {
      status : true,
      addonData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getViewAddonPage = async (req, res)=>{
  try{
    let addonItemId = req.params.addonItemId ;
    let dbAddonData = await dbRepository.getSingleAddonItem(addonItemId) ;
    if(dbAddonData.status != true){throw dbAddonData ;}

    let dbAddonSizePriceData = await dbRepository.getSingleAddonItem_PriceData(addonItemId) ;
    if(dbAddonSizePriceData.status != true){throw dbAddonSizePriceData ;}

    res.render('menu/addons/view_single_addon.hbs', {
      status : true,
      addonData : dbAddonData.data,
      addonSizePriceData : dbAddonSizePriceData.data
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.getEditAddonPage = async(req, res)=>{
 try{
   let addonItemId = req.params.addonItemId ;
   let dbAddonData = await dbRepository.getSingleAddonItem(addonItemId) ;
   if(dbAddonData.status != true){throw dbAddonData ;}

   let dbAddonSizePriceData = await dbRepository.getSingleAddonItem_PriceData(addonItemId) ;
   if(dbAddonSizePriceData.status != true){throw dbAddonSizePriceData ;}

   res.render('menu/addons/edit_single_addon.hbs', {
     status : true,
     addonData : dbAddonData.data,
     addonSizePriceData : dbAddonSizePriceData.data
   }) ;
 }catch (e) {
   logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
   res.render('general/error.hbs', {
     showBackLink : true,
     backLink : "/menu/addons",
     error : e
   }) ;
 }
} ;


exports.postEditAddonPage = async (req, res)=>{
  try {
    let categoryId = req.body.categoryId;
    let itemId = req.body.itemId;
    let itemName = req.body.itemName;
    let itemIsActive = req.body.isItemActive ;

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false);
    if (dbSizeData.status != true) {throw dbSizeData; }

    dbSizeData.data.forEach((element) => {
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`];
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`];

      if(isItemSizeActive == '1' || isItemSizeActive == '0'){
        // means it is a boolean
      }else{
        throw `Invalid value found for isItemSizeActive_${element.size_id}` ;
      }

      if(isNaN(itemSizePrice) || parseFloat(itemSizePrice) < 0){
        throw `Invalid value found for itemSizePrice_${element.size_id}` ;
      }
    });

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbItemData  = await explicitConnection.execute(`
        UPDATE menu_addons_table 
        SET item_name = :itemName, item_is_active = :itemIsActive WHERE item_id = :itemId `, {
        itemName,
        itemIsActive,
        itemId
      });

    /*
     * now that  imenu_addons_table data is taken care of, let's update the price data
     * So from the form, the data for addonPrice is received like this
     * price data for a size is in form  req.body.itemSizePrice_sizeId
     *         sizeId=1 =>  req.body.itemSizePrice_1
     *         sizeId=2 =>  req.body.itemSizePrice_2
     *
     *   Similarly the isItemActive for a particular size is in  req.body.isItemSizeActive_sizeId
     *        for sizeId=1  => req.body.isItemSizeActive_1
     *        for sizeId=1  => req.body.isItemSizeActive_2
     *
     *  The sql statement uses two CASE statements. ex :
     *
     *  UPDATE `menu_meta_rel_size_addons_table`
     *    SET `addon_price` = CASE
     *        WHEN `size_id` = '1' THEN '99.0000'
     *        WHEN `size_id` = '2' THEN '194.0000'
     *        WHEN `size_id` = '3' THEN '394.0000'
     *    END,
     *    `addon_size_active` = CASE
     *        WHEN `size_id` = '1' THEN true     (1 for true, 0 for false)
     *        WHEN `size_id` = '2' THEN true
     *        WHEN `size_id` = '3' THEN true
     *    END
     *    WHERE `item_id` = '48001'
     */


    let sizeData = dbSizeData.data;

    let sqlCaseString = 'UPDATE menu_meta_rel_size_addons_table  SET addon_price = CASE ';
    sizeData.forEach((element, index) => {
      let newItemPriceForSize = req['body'][`itemSizePrice_${element.size_id}`];
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newItemPriceForSize} `;
    });
    sqlCaseString += ' END, addon_size_active = CASE ';
    sizeData.forEach((element, index) => {
      let newIsItemActiveForSize = req['body'][`isItemSizeActive_${element.size_id}`];
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newIsItemActiveForSize} `;
    });
    sqlCaseString += ` END WHERE addon_id = ${itemId} `;

    let dbItemPriceData = await explicitConnection.execute(sqlCaseString);
    await explicitConnection.commit() ;

    res.redirect(`/menu/addons/view/${itemId}`);
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.getAddAddonPage = async (req, res)=> {
  try {
    let categoryId = req.params.categoryId;
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData; }

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false);
    if (dbSizeData.status != true) {throw dbSizeData;}

    res.render('menu/addons/add_new_addon.hbs', {
      addonGroupData: dbAddonGroupData.data,
      sizeData: dbSizeData.data
    });


  } catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.postAddAddonPage = async (req, res)=>{
  try {
    let categoryId = req.body.categoryId;
    let addonGroupId = req.body.addonGroupId;
    let itemName = req.body.itemName;
    let isItemActive = req.body.isItemActive;

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId);
    if (dbSizeData.status != true) {
      throw dbSizeData;
    }

    dbSizeData.data.forEach((element) => {
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`];
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`];

      if(isItemSizeActive == '1' || isItemSizeActive == '0'){
        // means it is a boolean
      }else{
        throw `Invalid value found for isItemSizeActive_${element.size_id}` ;
      }

      if(isNaN(itemSizePrice) || parseFloat(itemSizePrice) < 0){
        throw `Invalid value found for itemSizePrice_${element.size_id}` ;
      }

    });

    let explicitConnection = await dbConnection.getConnection();
    await explicitConnection.beginTransaction();

    let dbItemData = await explicitConnection.execute(`
      INSERT INTO menu_addons_table 
      (item_sr_no, item_name, item_category_id, item_addon_group_rel_id, item_is_active )
      SELECT COALESCE( (MAX( item_sr_no ) + 1), 1) , :itemName, :categoryId, :addonGroupId, :isItemActive 
      FROM menu_addons_table WHERE item_addon_group_rel_id = :addonGroupId `, {
      itemName,
      categoryId,
      addonGroupId,
      isItemActive
    });


    let itemInsertId = dbItemData[0].insertId;

    let sqlInsertString = ` INSERT INTO menu_meta_rel_size_addons_table 
      (addon_id, addon_price, addon_size_active, size_id, category_id) VALUES `;

    dbSizeData.data.forEach((element) => {
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`];
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`];

      sqlInsertString += ` ('${itemInsertId}', '${itemSizePrice}', '${isItemSizeActive}', '${element.size_id}', '${categoryId}' ), `;
    });
    sqlInsertString = sqlInsertString.slice(0, -2);

    let dbSizeInsertData = await explicitConnection.execute(sqlInsertString);
    await explicitConnection.commit();

    res.redirect(`/menu/addons`);
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.postDeleteAddonPage = async (req, res)=>{
  try{
    let itemId = req.body.itemId ;

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbItemData = await explicitConnection.execute(`DELETE FROM menu_addons_table WHERE item_id = :id `, {
      id : itemId
    }) ;

    let dbItemSizePriceData = await explicitConnection.execute(`DELETE FROM menu_meta_rel_size_addons_table WHERE addon_id = :id `, {
      id : itemId
    }) ;
    await explicitConnection.commit() ;

    res.redirect(`/menu/addons`);


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.getArrangeAddonsPage = async (req, res)=>{
  try{
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData; }

    let dbItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbItemData.status != true){throw dbItemData ;}

    let itemData = dbItemData.data ;
    res.render('menu/addons/arrange_addons.hbs',{
      addonGroupData : dbAddonGroupData.data,
      itemData
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.postArrangeAddonsPage = async (req, res)=>{
  try{

    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE menu_addons_table SET item_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is just the addonItemId
      sqlCaseString += ` WHEN item_id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += " END" ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getChangeDefaultAddonPage = async (req, res)=>{
  try{
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData; }

    let dbItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbItemData.status != true){throw dbItemData ;}

    let itemData = dbItemData.data ;
    res.render('menu/addons/change_default_addon.hbs',{
      addonGroupData : dbAddonGroupData.data,
      itemData
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/addons",
      error : e
    }) ;
  }
} ;


exports.postChangeDefaultAddonPage = async (req, res)=>{
  try{
    let addonGroupId = req.body.addonGroupId ;
    let newDefaultItemId = req.body.defaultItemId;

    let dbAddonItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbAddonItemData.status != true){throw dbAddonItemData ;}


    let sqlCaseString = "UPDATE menu_addons_table SET item_is_default = CASE " ;
    dbAddonItemData.data.forEach((element, index)=>{
      // element is an addon
      if(element.item_id == newDefaultItemId){
        sqlCaseString += ` WHEN item_id = ${element.item_id} THEN 1 ` ;
      }else{
        sqlCaseString += ` WHEN item_id = ${element.item_id} THEN 0 ` ;
      }
    }) ;
    sqlCaseString += ` END WHERE item_addon_group_rel_id = '${addonGroupId}' ` ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;




/************************************* Sizes *********************************/
exports.getAllSizesPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId);
    if(dbCategoryData.status != true){throw dbCategoryData;}

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData;}


    res.render('menu/size/all_sizes.hbs', {
      categoryData : dbCategoryData.data,
      sizeData : dbSizeData.data,
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.getEditSizePage = async (req, res)=>{
  try{

    let sizeId = req.params.sizeId ;

    let dbSizeData = await dbRepository.getSingleSize(sizeId);
    if(dbSizeData.status != true){throw dbSizeData;}

    let sizeData = dbSizeData.data ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(sizeData.size_category_id) ;
    if(dbCategoryData.status != true){throw dbCategoryData;}

    res.render('menu/size/edit_single_size.hbs', {
      sizeData,
      categoryData : dbCategoryData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postEditSizePage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let sizeId = req.body.sizeId ;
    let sizeName = req.body.sizeName ;
    let sizeNameAbbreviated = req.body.sizeNameAbbreviated ;
    let isSizeActive = req.body.isSizeActive ;

    let dbData = await dbConnection.execute(`
    UPDATE menu_meta_size_table
     SET size_name = :sizeName, size_name_short = :sizeNameAbbreviated, size_is_active = :isSizeActive
     WHERE size_id = :sizeId`,{
      sizeName,
      sizeNameAbbreviated,
      isSizeActive,
      sizeId
    }) ;

    res.redirect(`/menu/size/${categoryId}`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.getAddSizePage = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbCategoryData.status != true){throw dbCategoryData;}

    res.render('menu/size/add_new_size.hbs', {
      categoryData : dbCategoryData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postAddSizePage = async(req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let sizeName = req.body.sizeName ;
    let sizeNameAbbreviated = req.body.sizeNameAbbreviated ;
    let isSizeActive = req.body.isSizeActive ;


    let dbItemAddonData = await dbRepository.getAllAddonItemsInCategory(categoryId) ;
    if(dbItemAddonData.status != true){throw dbItemAddonData; }
    let addonsList = dbItemAddonData.data ;

    let dbItemDishesData = await dbRepository.getAllMenuItemsInCategory(categoryId) ;
    if(dbItemDishesData.status != true){throw dbItemDishesData ;}
    let dishList = dbItemDishesData.data ;

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbData = await explicitConnection.execute(`
    INSERT INTO menu_meta_size_table
    (size_sr_no, size_category_id, size_name, size_name_short, size_is_active)
    SELECT COALESCE( (MAX( size_sr_no ) + 1), 1), :categoryId , :sizeName , :sizeNameAbbreviated , :isSizeActive 
    FROM menu_meta_size_table WHERE size_category_id = :categoryId `,{
      categoryId,
      sizeName,
      sizeNameAbbreviated,
      isSizeActive
    }) ;

    let sizeInsertId = dbData[0].insertId ;


    //need to insert entries for size in menu_meta_rel_size_items_table and menu_meta_rel_size_addons_table
    if(dishList.length > 0){
      let sqlInsertDishesString = `INSERT INTO menu_meta_rel_size_items_table
     (item_id, item_price, item_size_active, size_id, item_category_id) VALUES ` ;
      dishList.forEach((dish)=>{
        sqlInsertDishesString += `('${dish.item_id}', '0', '0', '${sizeInsertId}', '${categoryId}'), ` ;
      }) ;
      sqlInsertDishesString = sqlInsertDishesString.slice(0,-2) ;
      let dbInsertDishesData = await explicitConnection.execute(sqlInsertDishesString) ;

    }


    if(addonsList.length > 0){
      let sqlInsertAddonsString = `INSERT INTO menu_meta_rel_size_addons_table
     (addon_id, addon_price, addon_size_active, size_id, category_id) VALUES ` ;
      addonsList.forEach((addon)=>{
        sqlInsertAddonsString += `('${addon.item_id}', '0', '0', '${sizeInsertId}', '${categoryId}'), ` ;
      }) ;
      sqlInsertAddonsString = sqlInsertAddonsString.slice(0,-2) ;
      let dbInsertAddonsData = await explicitConnection.execute(sqlInsertAddonsString) ;
    }

    await explicitConnection.commit() ;
    res.redirect(`/menu/size/${categoryId}`) ;




  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postDeleteSizePage = async(req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let sizeId = req.body.sizeId ;

    let explicitConnection = await dbConnection.getConnection() ;
    await explicitConnection.beginTransaction() ;

    let dbSizeData = await explicitConnection.execute(
      `DELETE FROM menu_meta_size_table WHERE size_id = :sizeId`,{
      sizeId
    }) ;

    let dbSizeDishesData = await explicitConnection.execute(
      `DELETE FROM menu_meta_rel_size_items_table WHERE size_id = :sizeId`,{
      sizeId
    }) ;

    let dbSizeAddonsData = await explicitConnection.execute(
      `DELETE FROM menu_meta_rel_size_addons_table WHERE size_id = :sizeId`,{
      sizeId
    }) ;
    await explicitConnection.commit() ;
    res.redirect(`/menu/size/${categoryId}`) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.getArrangeSizesPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId);
    if (dbCategoryData.status != true) {throw dbCategoryData; }

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId) ;
    if(dbSizeData.status != true){throw dbSizeData ;}

    res.render('menu/size/arrange_size.hbs',{
      categoryData : dbCategoryData.data,
      sizeList : dbSizeData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postArrangeSizesPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE menu_meta_size_table SET size_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is just the sizeId
      sqlCaseString += ` WHEN size_id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += ` END WHERE size_category_id = ${categoryId}` ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getChangeDefaultSizePage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId);
    if (dbCategoryData.status != true) {throw dbCategoryData; }

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId) ;
    if(dbSizeData.status != true){throw dbSizeData ;}

    res.render('menu/size/change_default_size.hbs',{
      categoryData : dbCategoryData.data,
      sizeList : dbSizeData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.postChangeDefaultSizePage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let newDefaultSizeId = req.body.defaultSizeId;

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData ;}

    let sqlCaseString = "UPDATE menu_meta_size_table SET size_is_default = CASE " ;
    dbSizeData.data.forEach((element)=>{
      // element is an sizeElement
      if(element.size_id == newDefaultSizeId){
        sqlCaseString += ` WHEN size_id = ${element.size_id} THEN 1 ` ;
      }else{
        sqlCaseString += ` WHEN size_id = ${element.size_id} THEN 0 ` ;
      }
    }) ;
    sqlCaseString += ` END WHERE size_category_id = '${categoryId}' ` ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;



/************************************************* Addon-Group ****************************************/
/************************************************* Addon-Group ****************************************/
/************************************************* Addon-Group ****************************************/





exports.getAllAddonGroupsPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId);
    if(dbCategoryData.status != true){throw dbCategoryData;}

    let dbAddonGroupData = await dbRepository.getAllAddonGroupsInCategory(categoryId) ;
    if(dbAddonGroupData.status != true){throw dbAddonGroupData;}

    res.render('menu/addonGroup/all_addongroup.hbs', {
      categoryData : dbCategoryData.data,
      addonGroupData : dbAddonGroupData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.getEditAddonGroupPage = async(req, res)=>{
  try{
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if(dbAddonGroupData.status != true){throw dbAddonGroupData;}

    let addonGroupData = dbAddonGroupData.data ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(addonGroupData.category_id) ;
    if(dbCategoryData.status != true){throw dbCategoryData;}

    res.render('menu/addonGroup/edit_single_addongroup.hbs', {
      addonGroupData,
      categoryData : dbCategoryData.data
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postEditAddonGroupPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let addonGroupId = req.body.addonGroupId ;
    let addonGroupName = req.body.addonGroupName ;
    let addonGroupType = req.body.addonGroupType ;
    let isAddonGroupActive = req.body.isAddonGroupActive ;

    let dbData = await dbConnection.execute(
      `UPDATE menu_meta_addongroups_table
      SET addon_group_display_name = :addonGroupName, addon_group_type = :addonGroupType, addon_group_is_active = :isAddonGroupActive
      WHERE rel_id = :addonGroupId`,{
        addonGroupName,
        addonGroupType,
        isAddonGroupActive,
        addonGroupId
    }) ;

    res.redirect(`/menu/addonGroup/${categoryId}`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.getAddAddonGroupPage = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbCategoryData.status != true){throw dbCategoryData;}

    res.render('menu/addonGroup/add_new_addongroup.hbs', {
      categoryData : dbCategoryData.data
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;


exports.postAddAddonGroupPage = async(req, res)=> {
  try {
    let categoryId = req.body.categoryId ;
    let addonGroupName = req.body.addonGroupName ;
    let addonGroupType = req.body.addonGroupType ;
    let isAddonGroupActive = req.body.isAddonGroupActive ;


    let dbData = await dbConnection.execute(`
    INSERT INTO menu_meta_addongroups_table
    (addon_group_sr_no, category_id, addon_group_display_name, addon_group_type, addon_group_is_active)
    SELECT COALESCE( (MAX( addon_group_sr_no ) + 1), 1), :categoryId , :addonGroupName , :addonGroupType , :isAddonGroupActive 
    FROM menu_meta_addongroups_table WHERE category_id = :categoryId `, {
      categoryId,
      addonGroupName,
      addonGroupType,
      isAddonGroupActive
    });

    res.redirect(`/menu/addonGroup/${categoryId}`) ;

  } catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postDeleteAddonGroupPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let addonGroupId = req.body.addonGroupId ;

    let dbDeleteData = await dbConnection.execute(
      `DELETE FROM menu_meta_addongroups_table WHERE rel_id = :addonGroupId`,{
        addonGroupId
      }) ;

    res.redirect(`/menu/addonGroup/${categoryId}`) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;



exports.getArrangeAddonGroupPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId);
    if (dbCategoryData.status != true) {throw dbCategoryData; }

    let dbAddonGroupData = await dbRepository.getAllAddonGroupsInCategory(categoryId) ;
    if(dbAddonGroupData.status != true){throw dbAddonGroupData ;}

    res.render('menu/addonGroup/arrange_addongroup.hbs',{
      categoryData : dbCategoryData.data,
      addonGroupList : dbAddonGroupData.data
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/menu/category",
      error : e
    }) ;
  }
} ;

exports.postArrangeAddonGroupPage = async (req, res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE menu_meta_addongroups_table SET addon_group_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is just the addonGroupId
      sqlCaseString += ` WHEN rel_id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += ` END WHERE category_id = ${categoryId}` ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      dbData,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;



