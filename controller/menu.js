const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const fs = require('fs') ;

exports.getAllCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/category/all_categories.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
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

    res.render('menu/category/view_single_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
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

    res.render('menu/category/edit_category',  {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postEditCategoryPage = async (req,res)=>{
  try{
    let categoryId = req.body.categoryId ;
    let categoryIsActive = req.body.isCategoryActive == 'true' ? 1 : 0 ; //converting from string to boolean
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
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getArrangeCategoryPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuCategories() ;
    if(dbData.status != true){throw dbData.data ;}

    let categoryData = dbData.data ;

    res.render('menu/category/arrange_category.hbs', {
      categoryData : categoryData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
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
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;




/************************************************** Dishes **************************************************** */


exports.getAllDishesPage = async (req, res)=>{
  try{
    let dbData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;
    if(dbData.status != true){throw dbData.data ;}

    let menuData = dbData.data ;
    res.render('menu/dishes/all_dishes.hbs', {
      status : true,
      menuData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getViewSingleDishPage = async (req, res)=>{
  try{
    let menuItemId = req.params.menuItemId ;

    let dbItemData = await dbRepository.getSingleMenuItem(menuItemId) ;
    if(dbItemData.status != true){throw dbItemData.data ;}

    let dbItemSizePriceData = await dbRepository.getSingleMenuItem_PriceData(menuItemId) ;
    if(dbItemSizePriceData.status != true){throw dbItemSizePriceData.data ;}

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
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getEditSingleDishPage = async (req, res)=>{
  try{
    let menuItemId = req.params.menuItemId ;

    let dbItemData = await dbRepository.getSingleMenuItem(menuItemId) ;
    if(dbItemData.status != true){throw dbItemData.data ;}

    let dbItemSizePriceData = await dbRepository.getSingleMenuItem_PriceData(menuItemId) ;
    if(dbItemSizePriceData.status != true){throw dbItemSizePriceData.data ;}

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
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postEditDishesPage = async (req, res)=>{
  try{
    let itemId = req.body.itemId ;
    let itemName = req.body.itemName ;
    let itemDescription = req.body.itemDescription ;
    let itemIsActive = req.body.isItemActive == 'true' ? 1 : 0 ;

    let dbItemData ;
    if(!req.file){
      // new image is not uploaded so simply update the db
      dbItemData = await dbConnection.execute(`
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

      dbItemData = await dbConnection.execute(`
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

    let categoryId = req.body.categoryId ;
    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData.data ;}
    let sizeData = dbSizeData.data ;

    let sqlCaseString = 'UPDATE menu_meta_rel_size_items_table  SET item_price = CASE ' ;
    sizeData.forEach((element, index)=>{
      let newItemPriceForSize = req['body'][`itemSizePrice_${element.size_id}`] ;
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newItemPriceForSize} ` ;
    }) ;

    sqlCaseString += ' END, item_size_active = CASE ' ;
    sizeData.forEach((element, index)=>{
      let newIsItemActiveForSize = req['body'][`isItemSizeActive_${element.size_id}`] ;
      newIsItemActiveForSize = newIsItemActiveForSize == 'true' ? 1 : 0 ;
      sqlCaseString += ` WHEN size_id = ${element.size_id} THEN ${newIsItemActiveForSize} ` ;
    }) ;
    sqlCaseString += ` END WHERE item_id = ${itemId} ` ;
    let dbItemPriceData = await dbConnection.execute(sqlCaseString) ;



    res.send({
      dbItemData,
      dbItemPriceData,
      sqlCaseString,
      link : "http://localhost:3002/menu/dishes"
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getAddDishPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let dbCategoryData = await dbRepository.getSingleMenuCategory(categoryId) ;
    if(dbCategoryData.status != true){throw dbCategoryData.data ;}

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false) ;
    if(dbSizeData.status != true){throw dbSizeData.data ;}

    res.render('menu/dishes/add_new_dish.hbs', {
      categoryData : dbCategoryData.data,
      sizeData : dbSizeData.data
    }) ;


  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postAddDishPage = async (req, res)=>{
  try{
    let itemName = req.body.itemName ;
    let itemDescription = req.body.itemDescription ;
    let isItemActive = req.body.isItemActive == 'true' ? 1 : 0 ;
    let categoryId = req.body.categoryId ;


    let itemImageFileName = req.myFileName ;

    let dbItemData = await dbConnection.execute(`
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
    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId) ;
    if(dbSizeData.status != true){throw dbSizeData.data ;}

    let sqlInsertString = ` INSERT INTO menu_meta_rel_size_items_table 
      ( item_id, item_price, item_size_active, size_id, item_category_id) VALUES ` ;

    dbSizeData.data.forEach((element)=>{
      let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`] ;
      let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`] ;
      isItemSizeActive = isItemSizeActive == 'true' ? 1 : 0 ;

      sqlInsertString += ` ( '${itemInsertId}', '${itemSizePrice}', '${isItemSizeActive}', '${element.size_id}', '${categoryId}' ), ` ;
    }) ;
    sqlInsertString = sqlInsertString.slice(0,-2) ;

    let dbSizeInsertData = await dbConnection.execute(sqlInsertString) ;

    res.send({
      status : true,
      dbItemData,
      itemInsertId,
      sqlInsertString,
      dbSizeInsertData,
      link : "http://localhost:3002/menu/dishes"
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.postDeleteDishPage = async (req, res)=>{
  try{
    let itemId = req.body.itemId ;
    let imageFileName = req.body.itemImageName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbItemData = await dbConnection.execute(`DELETE FROM menu_items_table WHERE item_id = :id `, {
      id : itemId
    }) ;

    let dbItemSizePriceData = await dbConnection.execute(`DELETE FROM menu_meta_rel_size_items_table WHERE item_id = :id `, {
      id : itemId
    }) ;

    res.send({
      status : true,
      dbItemData,
      dbItemSizePriceData,
      link : "http://localhost:3002/menu/dishes"
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getArrangeDishesPage = async (req, res)=>{
  try{
    let categoryId = req.params.categoryId ;

    let dbItemData = await dbRepository.getAllMenuItemsInCategory(categoryId) ;
    if(dbItemData.status != true){throw dbItemData.data ;}

    let itemData = dbItemData.data ;
    res.render('menu/dishes/arrange_dishes.hbs',{
      categoryId,
      itemData
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
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
    if(dbData.status != true){throw dbData.data ;}

    let addonData = dbData.data ;
    res.render('menu/addons/all_addons.hbs', {
      status : true,
      addonData
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getViewSingleAddonPage = async (req, res)=>{
  try{
    let addonItemId = req.params.addonItemId ;
    let dbAddonData = await dbRepository.getSingleAddonItem(addonItemId) ;
    if(dbAddonData.status != true){throw dbAddonData.data ;}

    let dbAddonSizePriceData = await dbRepository.getSingleAddonItem_PriceData(addonItemId) ;
    if(dbAddonSizePriceData.status != true){throw dbAddonSizePriceData.data ;}

    res.render('menu/addons/view_single_addon.hbs', {
      status : true,
      addonData : dbAddonData.data,
      addonSizePriceData : dbAddonSizePriceData.data
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getEditSingleAddonPage = async(req, res)=>{
 try{
   let addonItemId = req.params.addonItemId ;
   let dbAddonData = await dbRepository.getSingleAddonItem(addonItemId) ;
   if(dbAddonData.status != true){throw dbAddonData.data ;}

   let dbAddonSizePriceData = await dbRepository.getSingleAddonItem_PriceData(addonItemId) ;
   if(dbAddonSizePriceData.status != true){throw dbAddonSizePriceData.data ;}

   res.render('menu/addons/edit_single_addon.hbs', {
     status : true,
     addonData : dbAddonData.data,
     addonSizePriceData : dbAddonSizePriceData.data
   }) ;
 }catch (e) {
   res.send({
     status : false,
     e,
     e_message : e.message,
     e_toString : e.toString(),
     yo : "Beta ji koi error hai"
   }) ;
 }
} ;

exports.postEditAddonPage = async (req, res)=>{

  try {
    let itemId = req.body.itemId;
    let itemName = req.body.itemName;
    let itemIsActive = req.body.isItemActive ;

    let dbItemData  = await dbConnection.execute(`
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

    let categoryId = req.body.categoryId;
    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false);
    if (dbSizeData.status != true) {throw dbSizeData.data; }
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

    let dbItemPriceData = await dbConnection.execute(sqlCaseString);


    res.send({
      dbItemData,
      dbItemPriceData,
      sqlCaseString,
      link: "http://localhost:3002/menu/addons"
    });
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getAddNewAddonPage = async (req, res)=> {
  try {
    let categoryId = req.params.categoryId;
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData.data; }

    let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId, false);
    if (dbSizeData.status != true) {throw dbSizeData.data;}

    res.render('menu/addons/add_new_addon.hbs', {
      addonGroupData: dbAddonGroupData.data,
      sizeData: dbSizeData.data
    });


  } catch (e) {
    res.send({
      status: false,
      e,
      e_message: e.message,
      e_toString: e.toString(),
      yo: "Beta ji koi error hai"
    });
  }
} ;

exports.postAddNewAddonPage = async (req, res)=>{
  let categoryId = req.body.categoryId ;
  let addonGroupId = req.body.addonGroupId ;
  let itemName = req.body.itemName ;
  let isItemActive = req.body.isItemActive ;



  let dbItemData = await dbConnection.execute(`
      INSERT INTO menu_addons_table 
      (item_sr_no, item_name, item_category_id, item_addon_group_rel_id, item_is_active )
      SELECT COALESCE( (MAX( item_sr_no ) + 1), 1) , :itemName, :categoryId, :addonGroupId, :isItemActive 
      FROM menu_addons_table WHERE item_addon_group_rel_id = :addonGroupId `, {
    itemName,
    categoryId,
    addonGroupId,
    isItemActive
  }) ;


  let itemInsertId = dbItemData[0].insertId ;
  let dbSizeData = await dbRepository.getAllSizesInCategory(categoryId) ;
  if(dbSizeData.status != true){throw dbSizeData.data ;}

  let sqlInsertString = ` INSERT INTO menu_meta_rel_size_addons_table 
      (addon_id, addon_price, addon_size_active, size_id, category_id) VALUES ` ;

  dbSizeData.data.forEach((element)=>{
    let itemSizePrice = req.body[`itemSizePrice_${element.size_id}`] ;
    let isItemSizeActive = req.body[`isItemSizeActive_${element.size_id}`] ;

    sqlInsertString += ` ('${itemInsertId}', '${itemSizePrice}', '${isItemSizeActive}', '${element.size_id}', '${categoryId}' ), ` ;
  }) ;
  sqlInsertString = sqlInsertString.slice(0,-2) ;

  let dbSizeInsertData = await dbConnection.execute(sqlInsertString) ;

  res.send({
    status : true,
    dbItemData,
    itemInsertId,
    sqlInsertString,
    dbSizeInsertData,
    link : "http://localhost:3002/menu/addons"
  }) ;
} ;

exports.postDeleteAddonPage = async (req, res)=>{
  try{
    let itemId = req.body.itemId ;

    let dbItemData = await dbConnection.execute(`DELETE FROM menu_addons_table WHERE item_id = :id `, {
      id : itemId
    }) ;

    let dbItemSizePriceData = await dbConnection.execute(`DELETE FROM menu_meta_rel_size_addons_table WHERE addon_id = :id `, {
      id : itemId
    }) ;

    res.send({
      status : true,
      dbItemData,
      dbItemSizePriceData,
      link : "http://localhost:3002/menu/addons"
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getArrangeAddonsPage = async (req, res)=>{
  try{
    let addonGroupId = req.params.addonGroupId ;

    let dbAddonGroupData = await dbRepository.getSingleAddonGroup(addonGroupId);
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData.data; }

    let dbItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbItemData.status != true){throw dbItemData.data ;}

    let itemData = dbItemData.data ;
    res.render('menu/addons/arrange_addons.hbs',{
      addonGroupData : dbAddonGroupData.data,
      itemData
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
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
    if (dbAddonGroupData.status != true) {throw dbAddonGroupData.data; }

    let dbItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbItemData.status != true){throw dbItemData.data ;}

    let itemData = dbItemData.data ;
    res.render('menu/addons/change_default_addon.hbs',{
      addonGroupData : dbAddonGroupData.data,
      itemData
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.postChangeDefaultAddonsPage = async (req, res)=>{
  try{
    let addonGroupId = req.body.addonGroupId ;
    let newDefaultItemId = req.body.defaultItemId;

    let dbAddonItemData = await dbRepository.getAllAddonItemsInAddonGroup(addonGroupId) ;
    if(dbAddonItemData.status != true){throw dbAddonItemData.data ;}


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
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;










