const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const Paginator = require('../utils/Paginator') ;

exports.getAllGalleryItemPage = async(req, res)=>{
  try{
    let galleryData = await dbRepository.getAllGalleryItems() ;
    if(galleryData['status'] === false){throw galleryData ;}

    res.render('gallery/all_images.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      galleryData : galleryData['data'],
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


exports.getAddGalleryItemPage = async (req, res)=>{
  try{
    res.render('gallery/add_new_image.hbs', {
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


exports.postAddGalleryItemPage = async(req, res)=>{
  try{
    if(!req.file){
      throw "Image was not uploaded" ;
    }
    let galleryImageFileName = req.myFileName ;

    let dbData = await dbConnection.execute(`
    INSERT INTO gallery_table (gallery_item_sr_no, gallery_item_image_name, gallery_item_title, gallery_item_description)
      SELECT COALESCE( (MAX( gallery_item_sr_no ) + 1), 1), :new_image_name, '', '' FROM gallery_table   `,{
      new_image_name : galleryImageFileName
    }) ;

    res.send({
      dbData,
      link : "http://localhost:3002/gallery"
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

exports.postDeleteGalleryItemPage = async(req, res)=>{
  try{
    let galleryImageId = req.body.post_GalleryImageId ;
    let imageFileName = req.body.post_GalleryImageName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM gallery_table WHERE gallery_item_id = :id `, {
      id : galleryImageId
    }) ;
    res.send({
      dbData,
      link : "http://localhost:3002/gallery"
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

exports.getSingleGalleryItemPage = async (req, res)=>{
  try{
    // TODO check that galleryItemId is valid

    let galleryData = await dbRepository.getSingleGalleryItem(req.params.galleryItemId) ;
    if(galleryData['status'] === false){throw galleryData ;}

    res.render('gallery/single_image.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      galleryData : galleryData['data'],
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