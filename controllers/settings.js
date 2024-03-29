const logger = require('../middleware/logging') ;
const dbRepository = require('../data/DbRepository') ;
const dbConnection = require('../utils/databaseConnection_Restore') ;
const fs = require('fs') ;
const fs_extra = require('fs-extra') ;
const path = require('path') ;
const Constants = require('../utils/Constants') ;
const s3Utils = require('../utils/s3_utils') ;


exports.getSettingsPage = async(req, res)=>{
  try{
    res.render('general/settings.hbs', {

    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/settings",
      error : e
    }) ;
  }
} ;


exports.postDeletePublicImages = async (req, res)=>{
  try{
    let listOfDeletedFiles = await s3Utils.emptyImagesFolder() ;
    res.send({
      status : true,
      msg : "all files have been deleted in images folder",
      listOfDeletedFiles
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error_toString : e.toString(),
      e,
      yo : "Beta ji koi to error hai"
    }) ;
  }
} ;

exports.postRestorePublicImages = async (req, res)=>{
  try{
    await s3Utils.restoreImages() ;
    res.send({
      status : true,
      msg : "all files have been restored in s3 images"
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error_toString : e.toString(),
      e,
      yo : "Beta ji koi to error hai"
    }) ;
  }
} ;

exports.postTruncateTables = async (req, res)=>{
  try{
    let dbData = await dbConnection.query(`
      TRUNCATE TABLE blogs_table ;
      TRUNCATE TABLE gallery_table;
      TRUNCATE TABLE info_about_table;
      TRUNCATE TABLE info_contact_table;
      TRUNCATE TABLE menu_addons_table ;
      TRUNCATE TABLE menu_items_table ;
      TRUNCATE TABLE menu_addongroups_table ;
      TRUNCATE TABLE menu_category_table ;
      TRUNCATE TABLE menu_meta_rel_size_addons_table ;
      TRUNCATE TABLE menu_meta_rel_size_items_table ;
      TRUNCATE TABLE menu_size_table ;
      TRUNCATE TABLE menu_meta_subcategory_table ;
      TRUNCATE TABLE offer_special_table ;
      TRUNCATE TABLE order_table ;
    `) ;
    res.send({
      status : true,
      dbData
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error_toString : e.toString(),
      e,
      yo : "Beta ji koi to error hai"
    }) ;
  }
} ;



exports.postRestoreTables = async (req, res)=>{
  try{
    let restoreSql = fs.readFileSync(Constants.RESTORE_SQL_FILE_PATH, 'utf8') ;
    let dbData = await dbConnection.query(restoreSql) ;
    res.send({
      status : true,
      dbData,
    }) ;

  } catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error_toString : e.toString(),
      e,
      yo : "Beta ji koi to error hai"
    }) ;
  }
} ;