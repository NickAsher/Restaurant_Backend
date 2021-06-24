const path = require('path') ;


const SERVER_LOCATION = process.env.NODE_ENV == 'production' ?  'https://www.cms.rafique.in' : 'http://localhost:3002' ;
const IMAGE_BACKENDFRONT_LINK_PATH =  process.env.NODE_ENV == 'production' ? `https://s3.ap-south-1.amazonaws.com/www.rafique.in/restaurant-backend/images/` : "http://localhost:3002/public_images/" ;
const PUBLIC_DIRECTORY_LOCATION = process.env.NODE_ENV == 'production' ? 'https://s3.ap-south-1.amazonaws.com/www.rafique.in/restaurant-backend/public' : '' ;

const IMAGE_PATH = path.join(__dirname, "../images/") ;
const RESTORE_SQL_FILE_PATH = path.join(__dirname, '../restore/restaurant.sql') ;

module.exports = {
  SERVER_LOCATION,
  IMAGE_BACKENDFRONT_LINK_PATH,
  IMAGE_PATH,
  RESTORE_SQL_FILE_PATH,
  PUBLIC_DIRECTORY_LOCATION
} ;