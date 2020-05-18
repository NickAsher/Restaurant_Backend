const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../data/DbRepository') ;
const Constants = require('../utils/Constants') ;
const Paginator = require('../utils/Paginator') ;
const logger = require('../middleware/logging') ;



exports.getAllBlogsPage = async(req, res)=>{
  try {

    let countData = await dbRepository.getCount_Blogs();
    if (countData.status == false) {throw countData;}

    let totalNoOfItems = countData.data.total;
    let itemsPerPage = 10;
    let myPaginator = new Paginator(totalNoOfItems, itemsPerPage, req.query.page);
    let parsedPaginatorHtml = myPaginator.getPaginatedHTML("");

    let blogsData = await dbRepository.getBlogs_Paginated(myPaginator.getPageNo(), itemsPerPage);
    if (blogsData['status'] === false) {
      throw blogsData;
    }


    res.render('blogs/all_blogs.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH: Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      blogsData: blogsData['data'],
      parsedPaginatorHtml,
    });
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;


exports.getSingleBlogViewPage = async (req, res)=>{
  try{
    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){throw blogData ;}

    res.render('blogs/view_single_blog.hbs', {
      blogData : blogData.data ,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;


exports.getSingleBlogEditPage = async (req, res)=>{
  try{
    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){throw blogData ;}

    res.render('blogs/edit_single_blog.hbs', {
      blogData : blogData.data,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;


exports.postEditBlogPage = async(req, res)=>{
  try{
    let blogId = req.body.blogId;
    let oldImageFileName = req.body.blogOldImageFileName ;
    let blogAuthorName = req.body.blogAuthorName ;
    let blogTitle = req.body.blogTitle ;
    let blogContent = req.body.blogContent;

    let dbData ;
    if(!req.file){
      // No image was uploaded, so simply change the entries in the database
      dbData = await dbConnection.execute(`
        UPDATE blogs_table SET blog_author = :author, blog_title = :title, blog_content = :content
        WHERE blog_id = :id `, {
        author : blogAuthorName,
        title : blogTitle,
        content : blogContent,
        id : blogId
      }) ;
    } else {
      // an image was uploaded, so firstly delete the previous image and then change db entries
      let newImageFileName = req.myFileName ;

      fs.unlinkSync(Constants.IMAGE_PATH + oldImageFileName) ;
      dbData = await dbConnection.execute(`
        UPDATE blogs_table SET blog_author = :author, blog_title = :title, blog_content = :content, blog_display_image = :image
        WHERE blog_id = :id `, {
        author : blogAuthorName,
        title : blogTitle,
        content : blogContent,
        image : newImageFileName,
        id : blogId
      }) ;
    }
    res.redirect(`/blogs`) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;


exports.getAddNewBlogPage = async(req, res)=>{
  try{
    res.render('blogs/add_new_blog.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;

exports.postAddNewBlogPage = async (req, res)=>{
  try{
    let blogAuthorName = req.body.blogAuthorName ;
    let blogTitle = req.body.blogTitle ;
    let blogContent = req.body.blogContent ;
    let blogImageFileName = req.myFileName ;

    let dbData = await dbConnection.execute(`
      INSERT INTO blogs_table VALUES ( '', :datetime, :author, :title, :image, :content ) `, {
      datetime : new Date(),
      author : blogAuthorName,
      title: blogTitle,
      image: blogImageFileName,
      content: blogContent
    }) ;

    res.redirect(`/blogs`) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;

exports.postDeleteBlogPage = async (req, res)=>{
  try{
    let blogId = req.body.blogId ;
    let imageFileName = req.body.blogImageFileName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM blogs_table WHERE blog_id = :id `, {
      id : blogId
    }) ;

    res.redirect(`/blogs`) ;
  }catch (e) {
    res.render('general/error.hbs', {
      showBackLink : true,
      backLink : "/blogs",
      error : e
    }) ;
  }
} ;


