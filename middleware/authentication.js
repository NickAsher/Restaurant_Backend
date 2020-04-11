exports.authRedirectHome = (req, res, next)=>{
  // middleware to redirect already authenticated users to home page
  // this is used when someone who is already authenticated opens login page
  // in that case we send them back to home page.
  if(req.session.isLoggedIn == true){
    res.redirect('/') ;
    //TODO show message that you are already logged in
  }else{
    next() ;
  }
} ;


exports.isAuthenticated = (redirectBack)=>{
  /* Middleware to authenticate user on pages which need authentication
   * @param {string} redirectBack - The page where we should come back to after authentication
   *
   *  this function checks if the user is authenticated using session.isLoggedIn
   *    If they are, they simply go to their page
   *    If not, they are redirected to login page and query ?redirect=backPage is set
   *
   */
  return (req, res, next)=>{
    // if(req.session.isLoggedIn != true){   // checks for both false and undefined this way
    //   res.redirect(`/login?redirect=${redirectBack}`);
    //   //TODO show message that you need to be logged in
    // }else{
      next();
    // }
  } ;
} ;


exports.isAuthenticatedPostRequest =  (req, res, next)=>{
    /* Middleware to check if post request comes from authenticated user
   *
   *  this function checks if the user is authenticated using session.isLoggedIn
   *    If they are, the post requests does what it's supposed to do
   *    If not, it sends a status:false with error message
   */

    // if(req.session.isLoggedIn != true){   // checks for both false and undefined this way
    //   res.send({
    //     status : false,
    //     e : "User is not authenticated"
    //   }) ;
    // }else{
      next();
    // }

} ;