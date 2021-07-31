const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/databaseConnection') ;
const dbRepository = require('../data/DbRepository') ;
const Constants = require('../utils/Constants') ;
const logger = require('../middleware/logging') ;

exports.getViewAboutPage = async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/show_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getEditAboutPage = async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/edit_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;

exports.postEditAboutPage = async (req, res)=>{
  try{
    let aboutData = req.body.aboutUsData ;

    let returnDbData = await dbRepository.editAboutData(aboutData) ;
    if(returnDbData.status == false){throw returnDbData ;}

    res.redirect(`/about`) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/about",
      error : e
    }) ;
  }
} ;


exports.getViewContactPage = async (req, res)=>{
  try{
    let dbContactData = await dbRepository.getContactData() ;
    if(dbContactData['status'] === false){throw dbContactData ;}

    let contactData = dbContactData.data ;
    contactData.social_info = JSON.parse(contactData.social_info) ;

    res.render('info/show_contact.hbs', {
      contactData
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
};


exports.getEditContactPage =  async (req, res)=>{
  try{
    let dbContactData = await dbRepository.getContactData() ;
    if(dbContactData['status'] === false){throw dbContactData ;}

    let contactData = dbContactData.data ;
    contactData.social_info = JSON.parse(contactData.social_info) ;

    res.render('info/edit_contact.hbs', {
      contactData,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
};


exports.postEditContactPage = async (req, res)=>{
  try{
    let restaurantName = req.body.restaurantName ;
    let restaurantAddressLine1 = req.body.restaurantAddressLine1 ;
    let restaurantAddressLine2 = req.body.restaurantAddressLine2 ;
    let restaurantAddressLine3 = req.body.restaurantAddressLine3 ;
    let restaurantPhone = req.body.restaurantPhone ;
    let restaurantEmail = req.body.restaurantEmail ;
    let restaurantLatitude = req.body.restaurantLatitude ;
    let restaurantLongitude = req.body.restaurantLongitude ;

    let socialMediaLinks = JSON.stringify({
      facebook : req.body.restaurantLinkFacebook,
      instagram : req.body.restaurantLinkInstagram,
      twitter : req.body.restaurantLinkTwitter,
      youtube : req.body.restaurantLinkYoutube
    }) ;

    let returnData = await dbConnection.execute(
      `UPDATE info_contact_table SET restaurant_name =  :restaurantName, 
          restaurant_addr_1 = :restaurantAddressLine1, restaurant_addr_2 = :restaurantAddressLine2, 
          restaurant_addr_3 = :restaurantAddressLine3, restaurant_phone = :restaurantPhone, 
          restaurant_email = :restaurantEmail, latitude = :restaurantLatitude, longitude = :restaurantLongitude ,
          social_info = :socialMediaLinks
          WHERE restaurant_id = '1' ` ,{
        restaurantName,
        restaurantAddressLine1,
        restaurantAddressLine2,
        restaurantAddressLine3,
        restaurantPhone,
        restaurantEmail,
        restaurantLatitude,
        restaurantLongitude,
        socialMediaLinks
      }
    ) ;

    res.redirect(`/contact`) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/contact",
      error : e
    }) ;
  }
};


















