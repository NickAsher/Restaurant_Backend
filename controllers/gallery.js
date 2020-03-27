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

    res.redirect(`/gallery`) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postDeleteGalleryItemPage = async(req, res)=>{
  try{
    let galleryImageId = req.body.galleryItemId ;
    let imageFileName = req.body.galleryImageFileName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM gallery_table WHERE gallery_item_id = :id `, {
      id : galleryImageId
    }) ;
    res.redirect(`/gallery`) ;



  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getArrangeGalleryItemsPage = async(req, res)=>{
  try{
    let galleryData = await dbRepository.getAllGalleryItems() ;
    if(galleryData['status'] === false){throw galleryData ;}

    res.render('gallery/arrange_gallery_images.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      galleryData : galleryData['data'],
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

exports.postArrangeGalleryItemsPage = async (req, res)=>{
  try{
    let newArray = JSON.parse(req.body.sortedArray);


    /* Basically an array of galleryId arranged by user
    [
      "id6",
      "id3",
      "id2",
      "id1",
      "id5",
      "id4",
    ]
    We create a case statement like this
      UPDATE table SET sr_no = CASE
          WHEN id = id6 THEN 0
          WHEN id = id3 THEN 1
          WHEN id = id2 THEN 2
          WHEN id = id1 THEN 3
          WHEN id = id5 THEN 4
          WHEN id = id4 THEN 5
        END
     */

    let sqlCaseString = "UPDATE gallery_table SET gallery_item_sr_no = CASE " ;
    newArray.forEach((element, index)=>{
      // element is gallery_item_id
      sqlCaseString += ` WHEN gallery_item_id = ${element} THEN ${index} ` ;
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




