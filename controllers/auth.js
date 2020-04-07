const logger = require('../middleware/logging') ;
const dbRepository = require('../utils/DbRepository') ;
const dbConnection = require('../utils/database') ;
const bcrypt = require('bcrypt') ;
const crypto =  require('crypto') ;


exports.getLoginPage = async (req, res)=>{
  try{
    res.render('general/login.hbs') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;

exports.postLoginPage = async (req, res)=>{
  try{
    let email = req.body.email;
    let password = req.body.password;


    let dbReturnData = await dbRepository.getAdmin_ByEmail(email);
    if (dbReturnData.status == false) {throw dbReturnData;}

    let userData = dbReturnData.data;

    let matched = await bcrypt.compare(password, userData.password_hash);
    if (!matched) {throw "Invalid password";}

    req.session.isLoggedIn = true ;
    req.session.userId = userData.id ;
    res.send({
      status : true,
      success : "USER_LOGGEDIN"
    }) ;
  }catch(e){
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;