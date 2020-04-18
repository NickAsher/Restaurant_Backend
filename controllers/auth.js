const logger = require('../middleware/logging') ;
const dbRepository = require('../utils/DbRepository') ;
const dbConnection = require('../utils/database') ;
const bcrypt = require('bcrypt') ;
const crypto =  require('crypto') ;
const jwt = require('jsonwebtoken') ;


exports.getLoginPage = async (req, res)=>{
  try{
    res.render('auth/login.hbs') ;
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


exports.postForgotPassword = async (req, res)=>{
  try {
    let email = req.body.post_Email;
    let dbReturnData = await dbRepository.getAdmin_ByEmail(email);

    let userData = dbReturnData.data;
    let passwordHash = userData.password_hash;
    let randomString = crypto.randomBytes(32).toString('hex');
    let resetToken = jwt.sign({
        email: userData.email,
        random: randomString
      }, passwordHash, {expiresIn:'2h'}
    );

    let dbData = await dbRepository.resetPasswordToken(userData.id, resetToken);
    if (dbData.status == false) {throw dbData;}

    // TODO send the mail here
    res.send({
      status: true,
      success: "MAIL_SENT",
      link: `http://localhost:3002/resetPassword/${resetToken}`
    });

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error : e
    }) ;
  }

} ;

exports.postSignout = async(req, res)=>{
  try{
    req.session.destroy() ;
    res.clearCookie('my_session_id_backend') ;
    res.redirect('/') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      error : e
    }) ;
  }
} ;



exports.getResetPasswordTokenPage = async (req, res)=>{
  try{
    let resetToken = req.params.resetToken ;
    let dbReturnData = await dbRepository.getUser_ByResetToken(resetToken) ;
    if (dbReturnData.status == false) {throw dbReturnData;}

    let userData = dbReturnData.data ;

    // will throw an error if token is not signed by password_hash
    // or if token has expired
    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){throw "invalid token : email is not same in token" ;}

    //our token is verified now, render the page
    res.render('auth/reset_password.hbs', {
      resetToken,
      userId : userData.id
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;

exports.postResetPasswordToken = async (req, res)=>{
  try{
    let resetToken = req.body.post_resetToken ;
    let newPassword = req.body.post_newPassword ;
    let newPasswordAgain = req.body.post_newPasswordAgain ;

    let dbReturnData = await dbRepository.getUser_ByResetToken(resetToken) ;
    if (dbReturnData.status == false) {throw dbReturnData;}

    let userData = dbReturnData.data ;

    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){throw "invalid token : email is not same in token" ;}

    let new_password_hash = await bcrypt.hash(newPassword, 8);
    let dbData = await dbConnection.execute(
      `UPDATE admins_table SET password_hash = :new_password_hash,
      reset_password_token = '' WHERE id = :id `, {
        new_password_hash,
        newPassword,
        id : userData.id
      }) ;


    res.send({
      status : true,
      success : "PWD_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;