const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const fs = require('fs') ;
const Paginator = require('./utils/Paginator') ;
const multer = require('multer') ;

const controllerBlogs = require('./controller/blogs') ;
// const controllerGallery = require('./controller/gallery') ;
const controllerInfo = require('./controller/info') ;
// const controllerHome = require('./controller/home') ;
// const controllerMenu = require('./controller/menu') ;
const controllerOfferSpecial = require('./controller/offers') ;

const dbRepository = require('./utils/DbRepository') ;

const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./views")) ;


hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()) ;

let multerStorage = multer.diskStorage({
  destination : function(req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    let newFileName = Date.now() + "_" + file.originalname ;
    req.myFileName = newFileName ; // adding the newly created filename to my request
    cb(null , newFileName);
  }
}) ;
let upload = multer({storage : multerStorage}) ;

const IMAGE_PATH = path.join(__dirname, './images/') ;







app.get('/clear', (req, res)=>{
  res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;

  res.send(`
    <script>
        localStorage.removeItem('cart') ;
        localStorage.removeItem('total_items') ;
        localStorage.removeItem('total_items_price') ;
        
        window.location.href= '/menu' ;
    </script>
  `);
}) ;


app.get('/', async (req, res)=>{
  res.send("YOLO") ;
}) ;

app.get('/blogs', controllerBlogs.getAllBlogsPage) ;
app.get('/blogs/add', controllerBlogs.getAddNewBlogPage) ;
app.post('/blogs/add/save', upload.single('post_Image'), controllerBlogs.postAddNewBlogPage) ;
app.post('/blogs/delete', upload.none(), controllerBlogs.postDeleteBlogPage) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlogPage) ;
app.get('/blog/:blogId/edit', controllerBlogs.getSingleBlogEditPage) ;
app.post('/blog/edit/save', upload.single('post_Image'), controllerBlogs.postEditBlogPage) ;




app.get('/gallery', async(req, res)=>{
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
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
}) ;

app.get('/gallery/add-new-image', async (req, res)=>{
  try{
    res.render('gallery/add_new_image.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
}) ;

app.get('/gallery/:galleryItemId', async (req, res)=>{
  try{
    // TODO check that galleryItemId is valid

    let galleryData = await dbRepository.getSingleGalleryItem(req.params.galleryItemId) ;
    if(galleryData['status'] === false){throw galleryData ;}

    res.render('gallery/single_image.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      galleryData : galleryData['data'],
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
}) ;


app.get('/specials', controllerOfferSpecial.getAllOfferSpecials) ;
app.get('/specials/add', controllerOfferSpecial.getAddOfferSpecial) ;
app.post('/specials/add/save', upload.single('post_Image'), controllerOfferSpecial.postAddOfferSpecial) ;
app.post('/specials/delete', upload.none(), controllerOfferSpecial.postDeleteOfferSpecial) ;
app.get('/specials/:offerId', controllerOfferSpecial.getSingleOfferSpecial) ;
app.get('/specials/:offerId/edit', controllerOfferSpecial.getEditOfferSpecial) ;
app.post('/specials/edit/save', upload.single('post_Image'), controllerOfferSpecial.postEditOfferSpecial) ;

app.get('/about', controllerInfo.getAboutPage) ;
app.get('/about/edit', controllerInfo.getAboutEditPage) ;
app.post('/about/edit/save', controllerInfo.postAboutEditPage) ;
app.get('/contact', controllerInfo.getContactPage) ;
app.get('/contact/edit', controllerInfo.getContactEditPage) ;
app.post('/contact/edit/save', controllerInfo.postContactEditPage) ;




app.listen(3002, ()=>{
    console.log("The server is listening on port 3002") ;
}) ;