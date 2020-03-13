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
const controllerGallery = require('./controller/gallery') ;
const controllerInfo = require('./controller/info') ;
const controllerOrders =  require('./controller/orders') ;
// const controllerHome = require('./controller/home') ;
const controllerMenu = require('./controller/menu') ;
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


app.use((req, res, next)=>{
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  // res.locals.signedIn = req.session.isLoggedIn ;
  next() ;
}) ;




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

app.get('/login', async (req, res)=>{
  res.render('general/login.hbs') ;
}) ;
app.get('/blogs', controllerBlogs.getAllBlogsPage) ;
app.get('/blogs/add', controllerBlogs.getAddNewBlogPage) ;
app.post('/blogs/add/save', upload.single('post_Image'), controllerBlogs.postAddNewBlogPage) ;
app.post('/blogs/delete', upload.none(), controllerBlogs.postDeleteBlogPage) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlogPage) ;
app.get('/blog/:blogId/edit', controllerBlogs.getSingleBlogEditPage) ;
app.post('/blog/edit/save', upload.single('post_Image'), controllerBlogs.postEditBlogPage) ;

app.get('/gallery', controllerGallery.getAllGalleryItemPage) ;
app.get('/gallery/add', controllerGallery.getAddGalleryItemPage) ;
app.post('/gallery/add/save', upload.single('post_Image'), controllerGallery.postAddGalleryItemPage) ;
app.post('/gallery/delete', upload.none(), controllerGallery.postDeleteGalleryItemPage) ;
app.get('/gallery/arrange', controllerGallery.getArrangeGalleryItemsPage) ;
app.post('/gallery/arrange', upload.none(), controllerGallery.postArrangeGalleryItemsPage) ;


app.get('/specials', controllerOfferSpecial.getAllOfferSpecials) ;
app.get('/specials/arrange', controllerOfferSpecial.getArrangeOfferSpecialsPage) ;
app.post('/specials/arrange', upload.none(), controllerOfferSpecial.postOfferSpecialsPage) ;
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

app.get('/orders', controllerOrders.getOrderPage) ;
app.post('/orders/operation', controllerOrders.postOrderOperation) ;


app.get('/menu/category', controllerMenu.getAllCategoryPage) ;
app.get('/menu/category/view/:categoryId', controllerMenu.getViewCategoryPage) ;
app.get('/menu/category/edit/:categoryId', controllerMenu.getEditCategoryPage) ;
app.post('/menu/category/edit/save', upload.single('post_Image'), controllerMenu.postEditCategoryPage) ;
app.get('/menu/category/arrange', controllerMenu.getArrangeCategoryPage) ;
app.post('/menu/category/arrange', upload.none(), controllerMenu.postArrangeCategoryPage) ;

// app.post('/menu/category/delete', controllerMenu.getViewCategoryPage) ;
// app.get('/menu/category/manage/:categoryId', controllerMenu.getEditCategoryPage) ;
// app.post('/menu/category/manage/save', controllerMenu.getEditCategoryPage) ;

app.get('/menu/dishes', controllerMenu.getAllDishesPage) ;
app.get('/menu/dishes/view/:menuItemId', controllerMenu.getViewSingleDishPage) ;
app.get('/menu/dishes/edit/:menuItemId', controllerMenu.getEditSingleDishPage) ;
app.post('/menu/dishes/edit/save', upload.single('post_Image'), controllerMenu.postEditDishesPage) ;
app.get('/menu/dishes/add/:categoryId', controllerMenu.getAddDishPage) ;
app.post('/menu/dishes/add/save', upload.single('post_Image'), controllerMenu.postAddDishPage) ;
app.post('/menu/dishes/delete', upload.none(), controllerMenu.postDeleteDishPage ) ;
app.get('/menu/dishes/arrange/:categoryId', controllerMenu.getArrangeDishesPage) ;
app.post('/menu/dishes/arrange/', upload.none(), controllerMenu.postArrangeDishesPage) ;


app.get('/menu/addons', controllerMenu.getAllAddonItemsPage) ;
app.get('/menu/addons/view/:addonItemId', controllerMenu.getViewSingleAddonPage) ;
app.get('/menu/addons/edit/:addonItemId', controllerMenu.getEditSingleAddonPage) ;
app.post('/menu/addons/edit/save', upload.none(), controllerMenu.postEditAddonPage) ;
app.get('/menu/addons/add/:categoryId/:addonGroupId', controllerMenu.getAddNewAddonPage) ;
app.post('/menu/addons/add/save', upload.none(), controllerMenu.postAddNewAddonPage) ;
app.post('/menu/addons/delete', upload.none(), controllerMenu.postDeleteAddonPage ) ;
// app.get('/menu/addons/arrange/:addonGroupId', controllerMenu.getArrangeAddonPage) ;
// app.post('/menu/addons/arrange/', upload.none(), controllerMenu.postArrangeAddonPage) ;
// app.get('/menu/addons/change-default/:addonGroupId', controllerMenu.getChangeDefaultAddonPage) ;
// app.post('/menu/addons/change-default/save', upload.none(), controllerMenu.postChangeDefaultAddonPage) ;


app.listen(3002, ()=>{
    console.log("The server is listening on port 3002") ;
}) ;