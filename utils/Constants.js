const path = require('path') ;


const SERVER_LOCATION = process.env.NODE_ENV == 'production' ?  'https://www.cms.rafique.in' : 'http://localhost:3002' ;

const IMAGE_BACKENDFRONT_LINK_PATH =  `${SERVER_LOCATION}/public_images/`  ;
// const IMAGE_BACKENDFRONT_LINK_PATH =  `https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-backend/images/`  ;
const IMAGE_PATH = path.join(__dirname, "../images/") ;

const RESTORE_IMAGES_PATH = path.join(__dirname, "../restore/images") ;
const RESTORE_SQL_FILE_PATH = path.join(__dirname, '../restore/restaurant.sql') ;
const S3_IMAGES_FOLDER_WRITE_LOCATION = 'https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-backend/images/' ;
const PUBLIC_DIRECTORY_LOCATION = process.env.NODE_ENV == 'production' ? 'https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-backend/public' : '' ;

module.exports = {
  SERVER_LOCATION,
  IMAGE_BACKENDFRONT_LINK_PATH,
  IMAGE_PATH,
  RESTORE_IMAGES_PATH,
  RESTORE_SQL_FILE_PATH,
  PUBLIC_DIRECTORY_LOCATION
} ;