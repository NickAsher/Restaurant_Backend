const path = require('path') ;

const IMAGE_FRONTEND_LINK_PATH = "http://localhost:3000/images/" ;
const VIDEO_FRONTEND_LINK_PATH = "http://localhost:3000/videos/" ;
const IMAGE_BACKENDFRONT_LINK_PATH =  "http://localhost:8080/BackendFront/images/" ; // 'http://localhost:3003/public_images/' ;
const IMAGE_PATH = path.join(__dirname, "../images/") ;

const RESTORE_IMAGES_PATH = path.join(__dirname, "../restore/images") ;
const RESTORE_SQL_FILE_PATH = path.join(__dirname, '../restore/restaurant.sql') ;

module.exports = {
  IMAGE_FRONTEND_LINK_PATH,
  VIDEO_FRONTEND_LINK_PATH,
  IMAGE_BACKENDFRONT_LINK_PATH,
  IMAGE_PATH,
  RESTORE_IMAGES_PATH,
  RESTORE_SQL_FILE_PATH
} ;