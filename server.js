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

    res.render('blogs/single_edit_blog.hbs', {
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


app.get('/specials', async (req, res)=>{
  try{

    let offerData = await dbRepository.getAllOfferSpecialData() ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/all_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
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


app.get('/specials/add', async (req, res)=>{
  try{

    res.render('specials/add_new_offerspecial.hbs', {
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

app.get('/specials/:offerId', async (req, res)=>{
  try{
    //TODO check that offferId is valid
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/single_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
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

app.get('/specials/:offerId/edit', async (req, res)=>{
  try{
    //TODO check that offer id is valid
    let offerId = req.params.offerId ;
    let offerData = await dbRepository.getSingleOfferSpecial(offerId) ;
    if(offerData['status'] === false){throw offerData ;}

    res.render('specials/edit_offerspecial.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      offerData : offerData['data'],
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


app.get('/about', async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/show_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
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


app.get('/about/edit', async (req, res)=>{
  try{
    let aboutData = await dbRepository.getAboutData() ;
    if(aboutData['status'] === false){throw aboutData ;}

    res.render('info/edit_about.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      aboutData : aboutData['data'],
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


app.post('/about/edit/save', async (req, res)=>{
  try{
    let aboutData = req.body.post_aboutUsData ;

    let returnDbData = await dbRepository.editAboutData(aboutData) ;
    if(returnDbData.status == false){throw returnDbData ;}

    res.send({
        returnDbData,
        link : "http://localhost:3002/about"
      }
    ) ;

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


app.get('/contact', async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] === false){throw contactData ;}

    res.render('info/show_contact.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      contactData : contactData['data'],
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


app.get('/contact/edit', async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] === false){throw contactData ;}

    res.render('info/edit_contact.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      contactData : contactData['data'],
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

app.post('/contact/edit/save', async (req, res)=>{
  try{
    let restaurantName = req.body.post_name ;
    let restaurantAddressLine1 = req.body.post_addr1 ;
    let restaurantAddressLine2 = req.body.post_addr2 ;
    let restaurantAddressLine3 = req.body.post_addr3 ;
    let restaurantPhone = req.body.post_phone ;
    let restaurantEmail = req.body.post_email ;
    let restaurantLatitude = req.body.post_latitude ;
    let restaurantLongitude = req.body.post_longitude ;
    let restaurantOpeningHours = req.body.post_openingHours ;

    let returnData = await dbConnection.execute(
      `UPDATE info_contact_table SET restaurant_name =  :restaurantName, 
          restaurant_addr_1 = :restaurantAddressLine1, restaurant_addr_2 = :restaurantAddressLine2, 
          restaurant_addr_3 = :restaurantAddressLine3, restaurant_phone = :restaurantPhone, 
          restaurant_email = :restaurantEmail, latitude = :restaurantLatitude, longitude = :restaurantLongitude ,
          restaurant_hours = :restaurantOpeningHours
          WHERE restaurant_id = '1' ` ,{
        restaurantName,
        restaurantAddressLine1,
        restaurantAddressLine2,
        restaurantAddressLine3,
        restaurantPhone,
        restaurantEmail,
        restaurantLatitude,
        restaurantLongitude,
        restaurantOpeningHours
      }
    ) ;

    res.send({
      returnData,
      link : "http://localhost:3002/contact"
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