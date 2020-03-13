const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;

exports.getAboutPage = async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/show_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getAboutEditPage = async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/edit_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postAboutEditPage = async (req, res)=>{
  try{
    let aboutData = req.body.post_aboutUsData ;

    let returnDbData = await dbRepository.editAboutData(aboutData) ;
    if(returnDbData.status == false){throw returnDbData ;}

    res.send({
        returnDbData,
        link : "http://localhost:3002/about"
      }
    ) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getContactPage = async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] === false){throw contactData ;}

    res.render('info/show_contact.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      contactData : contactData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
};


exports.getContactEditPage =  async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] === false){throw contactData ;}

    res.render('info/edit_contact.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      contactData : contactData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
};


exports.postContactEditPage = async (req, res)=>{
  try{
    let restaurantName = req.body.post_name ;
    let restaurantAddressLine1 = req.body.post_addr1 ;
    let restaurantAddressLine2 = req.body.post_addr2 ;
    let restaurantAddressLine3 = req.body.post_addr3 ;
    let restaurantPhone = req.body.post_phone ;
    let restaurantEmail = req.body.post_email ;
    let restaurantLatitude = req.body.post_latitude ;
    let restaurantLongitude = req.body.post_longitude ;
    let restaurantOpeningHours = req.body.post_openingHours ;

    let returnData = await dbConnection.execute(
      `UPDATE info_contact_table SET restaurant_name =  :restaurantName, 
          restaurant_addr_1 = :restaurantAddressLine1, restaurant_addr_2 = :restaurantAddressLine2, 
          restaurant_addr_3 = :restaurantAddressLine3, restaurant_phone = :restaurantPhone, 
          restaurant_email = :restaurantEmail, latitude = :restaurantLatitude, longitude = :restaurantLongitude ,
          restaurant_hours = :restaurantOpeningHours
          WHERE restaurant_id = '1' ` ,{
        restaurantName,
        restaurantAddressLine1,
        restaurantAddressLine2,
        restaurantAddressLine3,
        restaurantPhone,
        restaurantEmail,
        restaurantLatitude,
        restaurantLongitude,
        restaurantOpeningHours
      }
    ) ;

    res.send({
      returnData,
      link : "http://localhost:3002/contact"
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
};


















