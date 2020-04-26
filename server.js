const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const session = require('express-session') ;

const csrf = require('csurf') ;
const logger = require('./middleware/logging') ;
const authenticationMiddleware = require('./middleware/authentication') ;


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
hbs.registerHelper('toJSON', function(obj) {
  return JSON.stringify(obj, null, 4);
});

app.use(express.static("public"));
app.use('/public_images', express.static(__dirname + '/images')) ;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()) ;
app.use(session({
  keys : ['a','b'],
  secret : "this is my secret", //key use to sign session data(only sign, not encrypt)
  resave : false, // don't resave session if it isn't changed
  saveUninitialized : false, //don't save an empty session
  name : 'my_session_id_backend', //name for the cookie that stores session id
  cookie : {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite :true,
    secret : "something",
    secure :false // use it when using https
  }
})) ;



app.use((req, res, next)=>{
  logger.info(`{'method' : '${req.method}','url':'${req.originalUrl}'}`) ;
  next() ;
}) ;

app.use(csrf()) ;
app.use(function(err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    logger.warn(`{'warn' : 'Invalid CSRF Token', 'method' : '${req.method}, 'url':'${req.originalUrl}'}`) ;
    res.status(422).render('general/error.hbs', {
      showBackLink : true,
      backLink : req.query.redirect,
      error : "Invalid CSRF Token"
    }) ;
  }
  else {
    next();
  }
});


app.use((req, res, next)=>{
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  res.locals._csrfToken = req.csrfToken() ; // this method will create a new csrf token

  // res.locals.signedIn = req.session.isLoggedIn ;
  next() ;
}) ;


app.get('/',  async (req, res)=>{
  res.redirect('/dashboard') ;
}) ;

app.get('/dashboard', authenticationMiddleware.isAuthenticated('dashboard'), async (req, res)=>{
  res.render("home/home_test.hbs") ;
}) ;

app.use(require('./routes/router_admins')) ;
app.use(require('./routes/router_auth')) ;
app.use(require('./routes/router_blogs')) ;
app.use(require('./routes/router_gallery')) ;
app.use(require('./routes/router_info')) ;
app.use(require('./routes/router_menu')) ;
app.use(require('./routes/router_offers')) ;
app.use(require('./routes/router_orders')) ;
app.use(require('./routes/router_settings')) ;


app.get('/error', async (req, res)=>{
  res.render('general/error.hbs', {
    error : {
      status : false,
      e_message : "This is some message",
      e_toString : "This error : This is some message",
      yo : "Beta ji koi error hai"
    }
  }) ;
}) ;

app.get('*', (req, res)=>{
  res.render('general/404.hbs') ;
}) ;






app.listen(3002, ()=>{
  logger.info('Server is listening on port 3002') ;
    console.log("The server is listening on port 3002") ;
}) ;