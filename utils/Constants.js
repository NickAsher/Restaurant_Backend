const path = require('path') ;


const IMAGE_BACKENDFRONT_LINK_PATH = process.env.NODE_ENV == 'production' ? 'http://15.206.167.175:3002/public_images/' : 'http://localhost:3002/public_images/' ;
const IMAGE_PATH = path.join(__dirname, "../images/") ;

const RESTORE_IMAGES_PATH = path.join(__dirname, "../restore/images") ;
const RESTORE_SQL_FILE_PATH = path.join(__dirname, '../restore/restaurant.sql') ;

module.exports = {

  IMAGE_BACKENDFRONT_LINK_PATH,
  IMAGE_PATH,
  RESTORE_IMAGES_PATH,
  RESTORE_SQL_FILE_PATH
} ;