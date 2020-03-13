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
      data : e.toString()
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
      data : e,
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
      data : e,
    } ;
  }
} ;


exports.getSingleBlog = async (blogId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM  blogs_table WHERE blog_id =  ${blogId} `
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      data : e,
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
      data : e,
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
      data : e,
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
      data : e,
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
      data : e,
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
      data : e,
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
      data : e
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
      data : e,
    } ;
  }
} ;


exports.getSingleOfferSpecial = async (offerId)=>{
  try {
    let dbData = await dbConnection.execute(
      `SELECT * FROM offer_special_table WHERE id = ${offerId}`
    ) ;
    return {
      status : true,
      data : dbData['0']['0']
    } ;
  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;

/* ********************************************** Orders ************************************ */
exports.getAllOrders_OfToday = async()=>{
  try{
    // let todayDate = moment(new Date()).format('YYYY-MM-DD hh:mm:ss') ;
    let todayDate = '2020-03-04 00:00:00' ;


    let dbData = await dbConnection.execute(
      `SELECT * FROM order_table2 WHERE datetime > '${todayDate}'`
    ) ;
    return {
      status : true,
      data : dbData['0']
    } ;
  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;

exports.changeOrderStatus = async(orderId, newOrderStatus)=>{
  try{
    let dbData = await dbConnection.execute(
      ` UPDATE order_table2 SET status = :newOrderStatus WHERE id = :orderId`, {
        newOrderStatus,
        orderId
    }) ;
    return {
      status : true
    } ;
  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;

/************************ Menu ****************************/
exports.getAllMenuCategories = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT * FROM `menu_meta_category_table` ORDER BY `category_sr_no` ASC"
    ) ;
    let categoryData = dbData['0'] ;
    categoryData.map(row=>{
      row.category_is_active = row.category_is_active == 1 ? true : false ;
    }) ;
    return {
      status : true,
      data : categoryData,
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;



exports.getSingleMenuCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_category_table WHERE category_id = :categoryId `,{
          categoryId
      }) ;
    let categoryData = dbData['0']['0'] ;
    categoryData.category_is_active = categoryData.category_is_active == 1 ? true : false ;
    return {
      status : true,
      data : categoryData,
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
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
      data : e,
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
      data : e,
    } ;
  }

} ;


exports.getAllAddonGroups_SeperatedByCategory = async()=>{
  try{
    let dbCategoryData = await this.getAllMenuCategories() ;
    if(dbCategoryData.status != true){throw dbCategoryData.data ;}

    let dbAddonGroupData = await dbConnection.execute(
      `SELECT * FROM menu_meta_addongroups_table ORDER BY category_id ASC, addon_group_sr_no ASC `
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
      data : e,
    } ;
  }
} ;

exports.getAllAddonGroupsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_addongroups_table WHERE category_id = '${categoryId}' ORDER BY addon_group_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getAllAddonGroups_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT rel_id, addon_group_display_name FROM menu_meta_addongroups_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;


exports.getSingleAddonGroup = async (addonGroupId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_addongroups_table
         INNER JOIN menu_meta_category_table
         ON menu_meta_addongroups_table.category_id = menu_meta_category_table.category_id 
         WHERE menu_meta_addongroups_table.rel_id = '${addonGroupId}' 
     `) ;
    return {
      status : true,
      data : dbData[0][0]
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
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
    if(dbAddonGroupCategoryData.status != true){throw dbAddonGroupCategoryData.data ;}

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
      data : e,
    } ;
  }
} ;


exports.getAllAddonItemsInAddonGroup = async (addonGroupRelId)=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT * FROM `menu_meta_rel_size_addons_table`, `menu_addons_table` " +
        "WHERE `menu_meta_rel_size_addons_table`.`addon_id` = `menu_addons_table`.`item_id`  " +
        "AND `addon_size_active` = 'yes' AND `item_is_active` = 'yes' " +
        "AND `menu_addons_table`.`item_addon_group_rel_id` = '" + addonGroupRelId  +
        "' ORDER BY `item_sr_no` ASC " );

    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
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
      data : e,
    } ;
  }
} ;

exports.getAddonDataInCategory = async (categoryId)=>{
  try{
    let categoryAddonGroupData = await dbConnection.execute(
        `SELECT * FROM menu_meta_addongroups_table WHERE category_id = '${categoryId}' ORDER BY addon_group_sr_no ASC `) ;
    categoryAddonGroupData = categoryAddonGroupData['0'] ;


    for(let i=0;i<categoryAddonGroupData.length; i++){
      let addonItemData = await this.getAllAddonItemsInAddonGroup(categoryAddonGroupData[i]['rel_id']) ;
      addonItemData = addonItemData['data'] ;

      addonItemData = addonItemData.reduce((result, currentObj)=>{
        if(result[currentObj['addon_id']] == null){
          result[currentObj['addon_id']] = [];
        }
        result[currentObj['addon_id']].push(currentObj);
        return result ;
      }, {}) ;

      categoryAddonGroupData[i]['addon_items_data'] = Object.values(addonItemData) ; // only keep the values of a key:value object and values are stored in an array structure
    }

    return {
      status : true,
      data : categoryAddonGroupData,
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;




exports.getSingleAddonItem = async(addonItemId)=>{
  try{
    let dbData = await dbConnection.execute(`
    SELECT menu_addons_table.*, menu_meta_addongroups_table.*, menu_meta_category_table.*
    FROM menu_addons_table INNER JOIN menu_meta_addongroups_table
    ON menu_addons_table.item_addon_group_rel_id = menu_meta_addongroups_table.rel_id
    INNER JOIN menu_meta_category_table
    ON menu_meta_category_table.category_id = menu_meta_addongroups_table.category_id
    WHERE menu_addons_table.item_id = '${addonItemId}'
    `) ;

    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;
exports.getSingleAddonItem_PriceData = async (addonItemId)=>{
  try{
    let dbData = await dbConnection.execute(`
      SELECT * FROM menu_meta_rel_size_addons_table
      INNER JOIN menu_meta_size_table 
      ON  menu_meta_rel_size_addons_table.size_id = menu_meta_size_table.size_id
      WHERE menu_meta_rel_size_addons_table.addon_id = '${addonItemId}'
    `) ;
    return {
      status : true,
      data : dbData[0]
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
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
      sqlString = `SELECT * FROM menu_meta_size_table
          WHERE size_category_id = '${categoryId}' AND size_is_active = '1'
          ORDER BY size_sr_no ASC ` ;
    }else{
      sqlString = `SELECT * FROM menu_meta_size_table
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
      data : e,
    } ;
  }

} ;


exports.getAllSizes_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT size_id, size_name FROM menu_meta_size_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;


exports.getAllMenuItems = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_items_table ORDER BY item_category_id ASC, item_sr_no ASC `
    ) ;
    let menuData = dbData['0'] ;
    menuData.forEach((menuItem)=>{
      menuItem.item_is_active = menuItem.item_is_active == '1' ? true : false ;
    }) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
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
      data : e,
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
      data : e,
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
      data : e,
    } ;
  }
} ;


exports.getSingleMenuItem = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table, menu_meta_category_table
        WHERE menu_items_table.item_id = '${itemId}'
        AND menu_meta_category_table.category_id = menu_items_table.item_category_id `
    ) ;

    let itemData = dbData['0']['0'] ;
    itemData.item_is_active = itemData.item_is_active == '1' ? true : false ;
    return {
      status : true,
      data : itemData,
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;

exports.getSingleMenuItem_PriceData = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(`
      SELECT * FROM menu_meta_rel_size_items_table
      INNER JOIN menu_meta_size_table 
      ON  menu_meta_rel_size_items_table.size_id = menu_meta_size_table.size_id
      WHERE menu_meta_rel_size_items_table.item_id = '${itemId}'
    `) ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }
} ;

exports.getAllMenuItems_SeperatedByCategory = async ()=>{
  try{
    let dbCategoryData = await this.getAllMenuCategories() ;
    if(dbCategoryData.status != true){throw dbCategoryData.data ;}

    let dbMenuData = await this.getAllMenuItems() ;
    if(dbMenuData.status != true ){throw dbMenuData.data ;}

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
      data : e,
    } ;
  }

} ;




