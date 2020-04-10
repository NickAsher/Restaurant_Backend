const logger = require('../middleware/logging') ;
const dbRepository = require('../utils/DbRepository') ;
const dbConnection = require('../utils/database') ;
const fs = require('fs') ;
const path = require('path') ;
const Constants = require('../utils/Constants') ;


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
    fs.rmdir(Constants.IMAGE_PATH) ;
    res.send({
      status : true,
      msg : "all files have been deleted in public images"
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