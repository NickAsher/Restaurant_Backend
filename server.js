const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const fs = require('fs') ;
const Paginator = require('./utils/Paginator') ;

// const controllerBlogs = require('./controllers/blogs') ;
// const controllerGallery = require('./controllers/gallery') ;
// const controllerInfo = require('./controllers/info') ;
// const controllerHome = require('./controllers/home') ;
// const controllerMenu = require('./controllers/menu') ;
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

app.get('/blogs', async(req, res)=>{

  let countData = await dbRepository.getCount_Blogs() ;
  if(countData.status == false){throw countData ;}

  let totalNoOfItems = countData.data.total ;
  let itemsPerPage  = 10 ;
  let myPaginator = new Paginator(totalNoOfItems, itemsPerPage, req.query.page) ;
  let parsedPaginatorHtml = myPaginator.getPaginatedHTML("") ;

  let blogsData = await dbRepository.getBlogs_Paginated(myPaginator.getPageNo(), itemsPerPage) ;
  if(blogsData['status'] === false){throw blogsData ;}


  res.render('blogs/all_blogs.hbs', {
    IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    blogsData : blogsData['data'],
    parsedPaginatorHtml,
  }) ;
}) ;

app.get('/blogs/add-new-blog', async(req, res)=>{
  try{
    res.render('blogs/add_new_blog.hbs', {
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

app.get('/blog/:blogId', async (req, res)=>{
  try{
    // TODO check that blogId is valid

    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){throw blogData ;}

    res.render('blogs/single_blog.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      blogData : blogData['data']['0'],
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


app.get('/blog/:blogId/edit', async (req, res)=>{
  try{
    // TODO check that blogId is valid

    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){throw blogData ;}

    res.render('blogs/single_blog_edit.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      blogData : blogData['data']['0'],
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



app.listen(3002, ()=>{
    console.log("The server is listening on port 3002") ;
}) ;