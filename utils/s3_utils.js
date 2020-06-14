const AWS = require('aws-sdk') ;
const fs = require('fs') ;

AWS.config.loadFromPath('./secret/aws_credentials.json');
let s3 = new AWS.S3({apiVersion: '2006-03-01'}) ;


exports.listImages = async (folderLocation)=>{
  return s3.listObjectsV2({
    Bucket : 'rafique.in',
    Prefix : `${folderLocation}`,
    Delimiter  : ""
  }).promise() ;
} ;


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
    Bucket : "rafique.in",
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
      Bucket: 'rafique.in',
      CopySource: `rafique.in/restaurant-backend/restore/${fileName}`,
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
