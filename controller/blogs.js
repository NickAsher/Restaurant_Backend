const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const Paginator = require('../utils/Paginator') ;



exports.getAllBlogsPage = async(req, res)=>{

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
} ;

exports.getAddNewBlogPage = async(req, res)=>{
  try{
    res.render('blogs/add_new_blog.hbs', {
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postAddNewBlogPage = async (req, res)=>{
  try{
    if(!req.file){
      throw "Image is not uploaded" ;
    }
    let blogAuthorName = req.body.post_BlogAuthor ;
    let blogTitle = req.body.post_BlogTitle ;
    let blogContent = req.body.post_BlogContent ;
    let blogImageFileName = req.myFileName ;

    let dbData = await dbConnection.execute(`
      INSERT INTO blogs_table VALUES ( '', :datetime, :author, :title, :image, :content ) `, {
      datetime : new Date(),
      author : blogAuthorName,
      title: blogTitle,
      image: req.myFileName,
      content: blogContent
    }) ;

    res.send({
      dbData,
      link : "http://localhost:3002/blogs"
    }) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postDeleteBlogPage = async (req, res)=>{
  try{
    let blogId = req.body.post_BlogId ;
    let imageFileName = req.body.post_ImageFileName ;

    fs.unlinkSync(Constants.IMAGE_PATH + imageFileName) ;
    let dbData = await dbConnection.execute(`DELETE FROM blogs_table WHERE blog_id = :id `, {
      id : blogId
    }) ;

    res.send({
      dbData,
      link : "http://localhost:3002/blogs"
    }) ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getSingleBlogPage = async (req, res)=>{
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

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.getSingleBlogEditPage = async (req, res)=>{
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

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postEditBlogPage = async(req, res)=>{
  try{
    let blogAuthorName = req.body.post_BlogAuthor ;
    let blogTitle = req.body.post_BlogTitle ;
    let blogContent = req.body.post_BlogContent;
    let blogId = req.body.post_BlogId;
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
      let oldImageFileName = req.body.post_OldImageFileName ;
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
    res.send({
      dbData,
      link : "http://localhost:3002/blogs"

    }) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;