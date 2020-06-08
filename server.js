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
const redis = require('redis') ;
let redisStore = require('connect-redis')(session) ;
require('dotenv').config() ;

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


let redisClient = redis.createClient({
  // host : process.env.NODE_ENV == 'production' ? process.env.REDIS_HOST_PRODUCTION : process.env.REDIS_HOST_LOCAL,
  host : '127.0.0.1',
  port : 6379
}) ;

app.use(session({
  name : 'my_session_id_backend', //name for the cookie that stores session id
  secret : "this is my secret", //key use to sign session data(only sign, not encrypt)
  resave : false, // don't resave session if it isn't changed
  saveUninitialized : false, //don't save an empty session
  cookie : {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite :'lax',
    secret : "something",
    secure :false // use it when using https
  },
  store: new redisStore({
  client: redisClient,
  prefix:'bsess:',
  ttl : 86400, // one day, this is also the default value of ttl
  disableTouch : true // disables resetting the ttl value when a session is accessed again. Meaning the key will expire after 1 day
}),

})) ;



app.use((req, res, next)=>{
  logger.info(`{'method' : '${req.method}','url':'${req.originalUrl}'}`) ;
  next() ;
}) ;


redisClient.on('error', (err)=>{
  logger.error(` 'redisError' : '${err}`) ;
}) ;

app.use((req, res, next)=>{
  if (!req.session) {
    logger.error(` 'redisError' : 'Looks like req.session is not defined`) ;
    return res.status(422).render('general/error.hbs', {
      status:false,
      error : "Looks like something is wrong with redis session server. req.session is undefined"
    });
  }
  next() ; // otherwise continue
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
  res.locals.adminName = req.session.adminName ;
  res.locals.permissionLevel = req.session.permissionLevel ;
  res.locals.isEnvironmentProduction = process.env.NODE_ENV == 'production' ? true : false ;
  res.locals.publicDirectoryLocation = Constants.PUBLIC_DIRECTORY_LOCATION ;

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