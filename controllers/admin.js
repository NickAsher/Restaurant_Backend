const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const logger = require('../middleware/logging') ;

exports.getAllAdminsPage = async(req, res)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM admins_table WHERE role = 'ADMIN'`
    ) ;
    if(dbData['status'] === false){throw dbData ;}

    res.render('admin/all_admins.hbs', {
      adminList : dbData[0],
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getAddNewAdminPage = async (req, res)=>{
  try{
    res.render('admin/add_new_admin.hbs', {

    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;








