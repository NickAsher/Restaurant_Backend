const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;





exports.getAllOfferSpecials = async (req, res)=>{
  try{

    let offerData = await dbRepository.getAllOfferSpecialData() ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/all_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getSingleOfferSpecial = async (req, res)=>{
  try{
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/view_single_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;


exports.getEditOfferSpecial = async (req, res)=>{
  try{
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/edit_single_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;


exports.postEditOfferSpecial = async(req, res)=>{
  try{
    let id = req.body.offerId ;
    let title = req.body.offerTitle ;
    let message = req.body.offerMessage ;
    let oldImageFileName = req.body.offerOldImageFileName ;

    let dbData ;
    if(!req.file){
      // a new file is not uploaded, means we only update title and message
      dbData = await dbConnection.execute(
        `UPDATE offer_special_table  SET title = :title, message = :message
        WHERE id = :id
      `, {
          title,
          message,
          id,
        }
      ) ;
    } else {
      // a new file is uploaded, so we delete the previous file and upload a new file
      let newImageFileName = req.myFileName ;
      fs.unlinkSync(Constants.IMAGE_PATH + oldImageFileName) ;

      dbData = await dbConnection.execute(
        `UPDATE offer_special_table  SET title = :title, message = :message, image = :image WHERE id = :id`, {
          title,
          message,
          image : newImageFileName,
          id,
        }
      ) ;
    }

    res.redirect(`/specials/view/${id}`) ;

  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;



exports.getAddOfferSpecial = async (req, res)=>{
  try{

    res.render('specials/add_new_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    }) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;


exports.postAddOfferSpecial = async (req, res)=>{
  try {

    let fileName = req.myFileName ;
    let title = req.body.offerTitle ;
    let message = req.body.offerMessage ;

    let dbData = await dbConnection.execute(
      `INSERT INTO offer_special_table ( sr_no, title, image, message, creation_datetime)
        SELECT COALESCE( (MAX( sr_no ) + 1), 1) ,  :title, :image, :message, :creation_datetime
        FROM offer_special_table 
      `, {
        title : title,
        image : fileName,
        message,
        creation_datetime : new Date()
      }
    ) ;

    res.redirect(`/specials`) ;

  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;


exports.postDeleteOfferSpecial = async (req, res)=>{
  try{
    let offerId = req.body.offerId ;
    let imageFileName = req.body.offerImageFileName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM offer_special_table WHERE id = :id `, {
      id : offerId
    }) ;

    res.redirect(`/specials`) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;


exports.getArrangeOfferSpecialsPage = async (req, res)=>{
  try{

    let offerData = await dbRepository.getAllOfferSpecialData() ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/arrange_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/specials",
      error : e
    }) ;
  }
} ;

exports.postOfferSpecialsPage = async (req, res)=>{
  try{
    let newArray = JSON.parse(req.body.sortedArray);

    let sqlCaseString = "UPDATE offer_special_table SET sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is gallery_item_id
      sqlCaseString += ` WHEN id = ${element} THEN ${index} ` ;
    }) ;
    sqlCaseString += " END" ;

    let dbData = await dbConnection.execute(sqlCaseString) ;
    res.send({
      status : true,
      msg : "ORDER_CHANGED"
    }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;