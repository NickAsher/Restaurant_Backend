const path = require('path') ;

const IMAGE_FRONTEND_LINK_PATH = "http://localhost:3000/images/" ;
const VIDEO_FRONTEND_LINK_PATH = "http://localhost:3000/videos/" ;
const IMAGE_BACKENDFRONT_LINK_PATH = "http://localhost:8080/BackendFront/images/" ;
const IMAGE_PATH = path.join(__dirname, "../images/") ;


module.exports = {
  IMAGE_FRONTEND_LINK_PATH,
  VIDEO_FRONTEND_LINK_PATH,
  IMAGE_BACKENDFRONT_LINK_PATH,
  IMAGE_PATH
} ;