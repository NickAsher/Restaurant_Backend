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



app.use((req, res, next)=>{
  // check if client has the cookie
  if (req.cookies.cart === undefined) {
    res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;
    console.log("cookies have been set") ;
  }
  next();
});



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




app.listen(3002, ()=>{
    console.log("The server is listening on port 3002") ;
}) ;