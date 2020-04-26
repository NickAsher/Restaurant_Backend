const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const logger = require('../middleware/logging') ;
const bcrypt = require('bcrypt') ;


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

exports.postAddNewAdminsPage = async (req, res)=>{
  try{
    let email = req.body.email ;
    let password = req.body.password ;
    let passwordHash = await bcrypt.hash(password, 8);
    let name = req.body.fullname ;
    let isAccountActive = req.body.isAccountActive ;
    let activeUntill = req.body.validUntill ;
    let role = req.body.role ;

    let dbData = await dbConnection.execute(
      `INSERT INTO admins_table (email, password_hash, name, account_is_active, active_till, role) 
      VALUES ( :email, :passwordHash, :name, :isAccountActive, :activeUntill, :role) `, {
        email,
        passwordHash,
        name,
        isAccountActive,
        activeUntill,
        role
      }
    ) ;

    res.redirect('/admins') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;








