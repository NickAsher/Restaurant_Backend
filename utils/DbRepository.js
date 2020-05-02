const express = require('express') ;
const dbConnection  = require('./database') ;
const _ = require('lodash') ;
const moment = require('moment') ;




exports.getCount_Blogs = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT COUNT(*) AS total FROM  blogs_table `
    );
    return {
      status : true,
      data : dbData['0']['0']
    } ;

  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getAllBlogs = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT `blog_id`, `blog_creation_date`, `blog_title`, `blog_display_image` FROM  `blogs_table`  ORDER BY `blog_creation_date` DESC"
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getBlogs_Paginated = async (pageNo, totalItemsPerPage)=>{
  try{
    let limit = totalItemsPerPage ;
    let offset = (pageNo-1)*totalItemsPerPage ;

    let dbData = await dbConnection.execute(
      `SELECT blog_id, blog_creation_date, blog_title, blog_display_image 
        FROM  blogs_table ORDER BY blog_creation_date DESC LIMIT ${limit} OFFSET ${offset} `
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleBlog = async (blogId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM  blogs_table WHERE blog_id =  ${blogId} `
    ) ;

    if(dbData[0].length != 1){
      throw "Blog Not Found" ;
    }
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllGalleryItems = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM gallery_table ORDER BY gallery_item_sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleGalleryItem = async (galleryItemId)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM  gallery_table WHERE gallery_item_id =  ${galleryItemId} `
    ) ;
    return {
      status : true,
      data : dbData['0']['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getContactData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_contact_table WHERE restaurant_id = 1`
    ) ;
    return {
      status : true,
      // the first 0 is for the because database data is sent in an array and is the 0th item,
      // the second is because even if we are getting one row, its still sent in an array form.
      // Its weird i know
      data : dbData['0']['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getSocialData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_social_table`
    ) ;
    return {
      status : true,
      // the first 0 is for the because database data is sent in an array and is the 0th item,
      // the second is because even if we are getting one row, its still sent in an array form.
      // Its weird i know
      data : dbData['0']['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAboutData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_about_table WHERE restaurant_id = 1`
    ) ;
    return {
      status : true,
      data : dbData['0']['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.editAboutData = async (newAboutUsData)=>{
  try {
    let returnData = await dbConnection.execute(
      `UPDATE info_about_table SET about_us1 = :aboutData WHERE restaurant_id = 1`, {
        aboutData : newAboutUsData
      }
    );

    return {
      status: true,
      data: returnData,
    };
  }catch (e) {
    return {
      status : false,
      error : e
    } ;
  }
} ;



exports.getAllOfferSpecialData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM offer_special_table ORDER BY sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleOfferSpecial = async (offerId)=>{
  try {
    let dbData = await dbConnection.execute(
      `SELECT * FROM offer_special_table WHERE id = ${offerId}`
    ) ;

    if(dbData[0].length != 1){
      throw "Offer not found" ;
    }
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

/************************************************ Users ********************************** */
exports.getAdmin_ByEmail = async(email)=>{
  try{
    let dbData = await dbConnection.execute(`
    SELECT * FROM admins_table WHERE email = :emailId `, {
      emailId : email
    }) ;
    if(dbData[0].length !== 1){
      throw "No account found for this email" ;
    }
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;


exports.resetPasswordToken = async (id, resetToken)=>{
  try{
    let dbData = await dbConnection.execute(
      `UPDATE admins_table SET reset_password_token = :resetToken WHERE id = :id `, {
        id,
        resetToken
      }) ;
    return {
      status : true,
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getUser_ByResetToken = async(resetToken)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM admins_table WHERE reset_password_token = :resetToken `, {
        resetToken
      }) ;
    if(dbData[0].length != 1){
      // token does not exist in db, invalid token
      throw "Invalid Token" ;
    }

    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;


/* ********************************************** Orders ************************************ */
exports.getAllOrders_OfToday = async(date)=>{
  try{
    // let todayDate = moment(new Date()).format('YYYY-MM-DD hh:mm:ss') ;
    let startDate = `${date} 00:00:00` ;
    let endDate = `${date} 23:59:59` ;


    let dbData = await dbConnection.execute(
      `SELECT * FROM order_table WHERE datetime > :startDate AND datetime < :endDate`, {
      startDate,
      endDate
    }) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.changeOrderStatus = async(orderId, newOrderStatus)=>{
  try{
    let dbData = await dbConnection.execute(
      ` UPDATE order_table SET status = :newOrderStatus WHERE id = :orderId`, {
        newOrderStatus,
        orderId
    }) ;
    return {
      status : true
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

/***************************************** Menu *********************************************/
/***************************************** Menu *********************************************/
/***************************************** Menu *********************************************/

exports.getAllMenuCategories = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT * FROM `menu_category_table` ORDER BY `category_sr_no` ASC"
    ) ;

    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;



exports.getSingleMenuCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_category_table WHERE category_id = :categoryId `,{
          categoryId
      }) ;
    if(dbData[0].length != 1){
      throw "Category Not found" ;
    }
    return {
      status : true,
      data : dbData[0][0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;

exports.getAllSubCategoryInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_subcategory_table WHERE category_id = '${categoryId}' ORDER BY subcategory_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;


exports.getSingleSubCategory = async (subcategoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_subcategory_table WHERE rel_id = '${subcategoryId}' `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;


exports.getAllAddonGroups_SeperatedByCategory = async()=>{
  try{
    let dbCategoryData = await this.getAllMenuCategories() ;
    if(dbCategoryData.status != true){throw dbCategoryData ;}

    let dbAddonGroupData = await dbConnection.execute(
      `SELECT * FROM menu_addongroups_table ORDER BY category_id ASC, addon_group_sr_no ASC `
    ) ;

    let categoryData = dbCategoryData.data ;
    let addonGroupData = dbAddonGroupData[0] ;

    categoryData.forEach((categoryElement)=>{
      categoryElement.addonGroups = addonGroupData.filter((addonGroupItem)=>{
        return addonGroupItem.category_id == categoryElement.category_id ;
      }) ;
    }) ;

    return {
      status : true,
      data : categoryData
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllAddonGroupsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_addongroups_table WHERE category_id = :categoryId ORDER BY addon_group_sr_no ASC `,{
          categoryId
      }) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;


exports.getAllAddonGroups_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT rel_id, addon_group_display_name FROM menu_addongroups_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleAddonGroup = async (addonGroupId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_addongroups_table
         INNER JOIN menu_category_table
         ON menu_addongroups_table.category_id = menu_category_table.category_id 
         WHERE menu_addongroups_table.rel_id = '${addonGroupId}' 
     `) ;

    if(dbData[0].length != 1){
      throw "Addon-Group Not found" ;
    }
    return {
      status : true,
      data : dbData[0][0]
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;



/**
 * Gives back all the addon items which are seperated by category and then addon groups
 *
 * @returns {Promise<{status: boolean, data: *}>}
 * @returns {boolean} status Whether the request for data failed or succeeded
 * @returns {object} all addon items which are seperated by category and addon groups
 */
exports.getAllAddonItems_Seperated = async()=>{
  try{
    let dbAddonGroupCategoryData = await this.getAllAddonGroups_SeperatedByCategory() ;
    if(dbAddonGroupCategoryData.status != true){throw dbAddonGroupCategoryData ;}

    let dbAddonItemData = await dbConnection.execute(
      `SELECT * FROM menu_addons_table ORDER BY item_addon_group_rel_id ASC, item_sr_no ASC`
    ) ;


    let addonGroupCategoryData = dbAddonGroupCategoryData.data ;
    let addonItemData = dbAddonItemData[0] ;

    addonGroupCategoryData.forEach((categoryElement)=>{
      categoryElement.addonGroups.forEach((addonGroupElement)=>{
        addonGroupElement.addonItems = addonItemData.filter((addonItem)=>{
          return addonItem.item_addon_group_rel_id == addonGroupElement.rel_id ;
        }) ;
      }) ;
    }) ;

    return {
      status : true,
      data : addonGroupCategoryData
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllAddonItemsInCategory = async(categoryId)=>{
  try{
    let dbData =await dbConnection.execute(
      `SELECT * FROM  menu_addons_table WHERE item_category_id = :categoryId ORDER BY item_sr_no `,{
        categoryId
    }) ;

    return {
      status : true,
      data : dbData[0]
    } ;

  }catch (e) {
    return {
      status : false,
      error : e
    } ;
  }
} ;

exports.getAllAddonItemsInAddonGroup = async (addonGroupRelId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM  menu_addons_table WHERE item_addon_group_rel_id = '${addonGroupRelId}' ORDER BY item_sr_no ASC `
    );
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllAddonItems_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT item_id, item_name FROM menu_addons_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;



exports.getSingleAddonItem = async(addonItemId)=>{
  try{
    let dbData = await dbConnection.execute(`
    SELECT menu_addons_table.*, menu_addongroups_table.*, menu_category_table.*
    FROM menu_addons_table INNER JOIN menu_addongroups_table
    ON menu_addons_table.item_addon_group_rel_id = menu_addongroups_table.rel_id
    INNER JOIN menu_category_table
    ON menu_category_table.category_id = menu_addongroups_table.category_id
    WHERE menu_addons_table.item_id = '${addonItemId}'
    `) ;

    if(dbData[0].length != 1){
      throw "Addon Item Not found" ;
    }
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;
exports.getSingleAddonItem_PriceData = async (addonItemId)=>{
  try{
    let dbData = await dbConnection.execute(`
      SELECT * FROM menu_meta_rel_size_addons_table
      INNER JOIN menu_size_table 
      ON  menu_meta_rel_size_addons_table.size_id = menu_size_table.size_id
      WHERE menu_meta_rel_size_addons_table.addon_id = '${addonItemId}'
    `) ;
    return {
      status : true,
      data : dbData[0]
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;



exports.getAllSizesInCategory = async (categoryId, activeOnly=false)=>{
  /* Returns all the sizes in a category
   * @param categoryId : The category for which the sizes are needed
   * @param activeOnly : a boolean indicating, if whether all sizes should be retreived or those marked as active
   *                     by default, all sizes will be returned
   */
  try{
    let sqlString ;
    if(activeOnly){
      sqlString = `SELECT * FROM menu_size_table
          WHERE size_category_id = '${categoryId}' AND size_is_active = '1'
          ORDER BY size_sr_no ASC ` ;
    }else{
      sqlString = `SELECT * FROM menu_size_table
          WHERE size_category_id = '${categoryId}'
          ORDER BY size_sr_no ASC ` ;
    }
    let dbData = await dbConnection.execute(sqlString) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;


exports.getAllSizes_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT size_id, size_name FROM menu_size_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getSingleSize = async (sizeId)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_size_table WHERE size_id = :sizeId`,{
      sizeId
    }) ;

    if(dbData[0].length != 1){
      throw "Size Not found" ;
    }
    return {
      status : true,
      data : dbData[0][0],
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllMenuItems = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_items_table ORDER BY item_category_id ASC, item_sr_no ASC `
    ) ;

    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllMenuItemsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table WHERE item_category_id = '${categoryId}' ORDER BY item_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;

exports.getAllMenuItemsInSubCategory = async (subcategoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table WHERE item_subcategory_rel_id = '${subcategoryId}' ORDER BY item_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;

exports.getAllMenuItems_NameOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT item_id, item_name FROM menu_items_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleMenuItem = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table, menu_category_table
        WHERE menu_items_table.item_id = '${itemId}'
        AND menu_category_table.category_id = menu_items_table.item_category_id `
    ) ;

    if(dbData[0].length != 1){
      throw "Menu Item not found" ;
    }
    return {
      status : true,
      data : dbData[0][0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;

exports.getSingleMenuItem_PriceData = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(`
      SELECT * FROM menu_meta_rel_size_items_table
      INNER JOIN menu_size_table 
      ON  menu_meta_rel_size_items_table.size_id = menu_size_table.size_id
      WHERE menu_meta_rel_size_items_table.item_id = '${itemId}'
    `) ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllMenuItems_SeperatedByCategory = async ()=>{
  try{
    let dbCategoryData = await this.getAllMenuCategories() ;
    if(dbCategoryData.status != true){throw dbCategoryData ;}

    let dbMenuData = await this.getAllMenuItems() ;
    if(dbMenuData.status != true ){throw dbMenuData ;}

    let categoryData = dbCategoryData.data ;
    let menuData = dbMenuData.data ;

    categoryData.forEach((categoryElement)=>{
      categoryElement.items = menuData.filter((menuItem)=>{
        return categoryElement.category_id == menuItem.item_category_id ;
      }) ;
    }) ;

    return {
      status : true,
      data : categoryData
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;




