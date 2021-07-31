const AWS = require('aws-sdk') ;
const fs = require('fs') ;
const Constants = require('./Constants') ;

AWS.config.loadFromPath('./secret/aws_credentials.json');
let s3 = new AWS.S3({apiVersion: '2006-03-01'}) ;


exports.listImages = async (folderLocation)=>{
  return s3.listObjectsV2({
    Bucket : Constants.S3_BUCKET_LOCATION,
    Prefix : `${folderLocation}`,
    Delimiter  : ""
  }).promise() ;
} ;



exports.deleteImage = (imageName)=>{
  return s3.deleteObject({
    Bucket : Constants.S3_BUCKET_LOCATION,
    Key : `restaurant-backend/images/${imageName}`,
  }).promise() ;
} ;


exports.deleteImages = async (arrayOfImages)=>{
  let imagesKeyArray = [] ;
  arrayOfImages.forEach((imageName)=>{
    imagesKeyArray.push({
      Key : `restaurant-backend/images/${imageName}`
    }) ;
  }) ;

  return s3.deleteObjects({
    Bucket: Constants.S3_BUCKET_LOCATION,
    Delete: {
      Objects: imagesKeyArray,
      Quiet: false
    }
  }).promise() ;
} ;


exports.emptyImagesFolder = async()=>{
  let listOfImages = await this.listImages("restaurant-backend/images/") ;
  listOfImages = listOfImages.Contents ;
  if(listOfImages.length <= 1){
    // it means there are no images in the folder, 0th item is always the folder itself
    return ;
  }

  let deleteArray = [] ;
  // we start from 1 because the 0th item is the folder itself. and S3 will delete the folder
  for(let i=1;i<listOfImages.length;i++){
    deleteArray.push({Key : listOfImages[i]['Key'] }) ;
  }

  return s3.deleteObjects({
    Bucket : Constants.S3_BUCKET_LOCATION,
    Delete: {
      Objects: deleteArray,
      Quiet: false
    }
  }).promise() ;

} ;



exports.restoreImages = async ()=>{
  let listOfImages = await this.listImages("restaurant-backend/restore/") ;
  listOfImages = listOfImages.Contents ;
  if(listOfImages.length <= 1){
    return ;
  }

  for(let i=1; i<listOfImages.length; i++){
    let fileName = this.getFileNameFromKey(listOfImages[i]['Key']) ;

    s3.copyObject({
      Bucket: Constants.S3_BUCKET_LOCATION,
      CopySource: `${Constants.S3_BUCKET_LOCATION}/restaurant-backend/restore/${fileName}`,
      Key: `restaurant-backend/images/${fileName}`,
      ACL : 'public-read'

    }, (err, data)=>{
      if(err){
        console.log(err) ;
      }
    }) ;
  }

} ;


exports.getFileNameFromKey = (key)=>{
  // The file name is something like this restaurant-backend/restore/something.jpg
  return key.split('/').pop() ;
} ;
