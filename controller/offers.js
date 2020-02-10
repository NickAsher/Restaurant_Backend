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
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getAddOfferSpecial = async (req, res)=>{
  try{

    res.render('specials/add_new_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.postAddOfferSpecial = async (req, res)=>{
  try {
    if(!req.file){
      throw "Image is not uploaded" ;
    }
    let fileName = req.myFileName ;
    let title = req.body.post_OfferTitle ;
    let message = req.body.post_OfferMessage ;

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

    res.send({
      dbData,
      link : "http://localhost:3002/specials"
    }) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getSingleOfferSpecial = async (req, res)=>{
  try{
    //TODO check that offferId is valid
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/single_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getEditOfferSpecial = async (req, res)=>{
  try{
    //TODO check that offer id is valid
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/edit_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.postEditOfferSpecial = async(req, res)=>{
  try{
    let title = req.body.post_OfferTitle ;
    let message = req.body.post_OfferMessage ;
    let id = req.body.post_Id ;
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
      let oldImageFileName = req.body.post_OldImageFileName ;
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

    res.send({
      dbData,
      link : "http://localhost:3002/specials"

    }) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.postDeleteOfferSpecial = async (req, res)=>{
  try{
    let offerId = req.body.post_OfferId ;
    let imageFileName = req.body.post_ImageFileName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM offer_special_table WHERE id = :id `, {
      id : offerId
    }) ;

    res.send({
      dbData,
      link : "http://localhost:3002/specials"
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

