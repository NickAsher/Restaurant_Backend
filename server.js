const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const fs = require('fs') ;
const multer = require('multer') ;

const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./views")) ;

hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('increment', function (arg1) {
  arg1++;
  return arg1;
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
  console.log(`[${req.method} ${req.originalUrl} ]`) ;
  next() ;
}) ;

app.use((req, res, next)=>{
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  // res.locals.signedIn = req.session.isLoggedIn ;
  next() ;
}) ;




app.get('/', async (req, res)=>{
  res.send("YOLO") ;
}) ;

app.get('/login', async (req, res)=>{
  res.render('general/login.hbs') ;
}) ;

app.use(require('./routes/router_blogs')) ;
app.use(require('./routes/router_gallery')) ;
app.use(require('./routes/router_offers')) ;
app.use(require('./routes/router_info')) ;
app.use(require('./routes/router_orders')) ;
app.use(require('./routes/router_menu')) ;


app.listen(3002, ()=>{
    console.log("The server is listening on port 3002") ;
}) ;