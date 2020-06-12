const path = require('path') ;
const fs = require('fs') ;
const AWS = require('aws-sdk') ;


AWS.config.loadFromPath('./secret/aws_credentials.json');
let s3 = new AWS.S3({apiVersion: '2006-03-01'}) ;


exports.uploadImageToS3 = async (req, res, next)=>{

  if(!req.file || req.myFileError) {
    next();

  }else{
    s3.upload({
      Bucket : 'rafique.in',
      Key : `restaurant-backend/images/${req.myFileName}`,
      Body : await fs.readFileSync(path.join(__dirname,`./../images/${req.myFileName}`)),
      ACL : 'public-read',

    }).promise()
      .then((data)=>{
        fs.unlinkSync(path.join(__dirname,`./../images/${req.myFileName}`)) ;
        next();
      })
      .catch((err)=>{
        req.myFileError = "Error in uploading to S3" + err ;
        next();
      }) ;

  }
} ;