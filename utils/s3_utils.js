const AWS = require('aws-sdk') ;
AWS.config.loadFromPath('./secret/aws_credentials.json');
const fs = require('fs') ;


let s3 = new AWS.S3({apiVersion: '2006-03-01'}) ;

exports.uploadImage = async (imageName)=>{


  s3.upload({
    Bucket : 'rafique.in',
    Key : `restaurant-backend/images/${imageName}`,
    Body : await fs.readFileSync(`../images2/${imageName}`),
    ACL : 'public-read',

  }).promise()
    .then((data)=>{
      //TODO File successfully uploaded, delete the file from local images folder now
      // fs.unlinkSync(`../images2/${imageName}`) ;
      console.log(data) ;
    })
    .catch((err)=>{
      //TODO there has been an error. add a logger warning and tell the user that upload is not successfull
      console.log('error', err) ;
    }) ;

} ;

exports.deleteImage = (imageName)=>{

  return s3.deleteObject({
    Bucket : 'rafique.in',
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
    Bucket: 'rafique.in',
    Delete: {
      Objects: imagesKeyArray,
      Quiet: false
    }
  }).promise().then((data)=>{
    console.log(data) ;
  }).catch((err)=>{
    throw new Error(err) ;
  }) ;

} ;



exports.emptyBucket = async(directoryName)=>{


  return s3.listObjectsV2({
    Bucket : "rafique.in",
    Prefix : "restaurant-backend/restore/",
    Delimiter  : ""

  }).promise().then((listData)=>{

    if(listData.Contents.length == 0){
      console.log("There were no items in the specified location") ;
      return ;
    }

    let deleteArray = [] ;
    // we start from 1 because the 0th item is the folder itself. and S3 will delete the folder
    for(let i=1;i<listData.Contents.length;i++){
      deleteArray.push({Key : listData.Contents[i]['Key'] }) ;
    }

    console.log(deleteArray) ;
  //   return s3.deleteObjects({
  //     Bucket : "rafique.in",
  //     Delete: {
  //       Objects: deleteArray,
  //       Quiet: false
  //     }
  //   }).promise() ;
  //
  // }).then((data)=>{
  //   console.log("Images successfully deleted", data) ;

  }).catch((err)=>{
    console.log(err) ;
  }) ;
} ;



exports.copyFolder = async ()=>{

  return s3.copyObject({
    Bucket: 'rafique.in',
    CopySource: "rafique.in/restaurant-backend/restore/btn_apple.png",
    Key: "restaurant-backend/images2/btn_apple.png",
    ACL : 'public-read'

  }).promise().then((data)=>{
    console.log(data) ;
  }).catch((err)=>{
    console.log("Error", err) ;
  }) ;

} ;
