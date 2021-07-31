const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/databaseConnection') ;
const dbRepository = require('../data/DbRepository') ;
const Constants = require('../utils/Constants') ;
const moment = require('moment') ;
const orderParseUtils = require('../utils/order_parse_utils') ;
const logger = require('../middleware/logging') ;

exports.getOrderPage = async (req, res)=>{
  try{
    let dbReturnData ;
    if(req.query.date){
      let date = req.query.date ;
      dbReturnData = await dbRepository.getAllOrders_OfToday(date) ;
    } else{
      dbReturnData = await dbRepository.getAllOrders() ;
    }
    if(dbReturnData.status == false){throw `${dbReturnData} : unable to get orders from db` ;}

    let menuNameData = await orderParseUtils.getMenuNameData() ;
    if(menuNameData.status!= true){throw menuNameData ;}


    dbReturnData.data.map(row=>{
      row.userDetails = JSON.parse(row.userDetails) ;
      row.address = JSON.parse(row.address) ;
      row.cart = orderParseUtils.parseCartFromBackendToAdminOrder(menuNameData,  JSON.parse(row.cart)) ;
      row.paymentData = JSON.parse(row.paymentData) ;
      row.date = moment(row.datetime).format('ddd, Do MMM ') ;
      row.datetime = moment(row.datetime).format('h:mm a') ;
    }) ;


    res.render('orders/all_orders.hbs', {
      orderData : dbReturnData.data
    }) ;


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.render('general/error.hbs', {
      showBackLink : false,
      error : e
    }) ;
  }
} ;





exports.postOrderOperation = async (req, res)=>{
  try{
    let orderId = req.body.id ;
    let operation = req.body.operation ;
    let newOrderStatus ;
    switch (operation){
      case "accept" :
        newOrderStatus = "PREPARING" ;
        break ;
      case "complete" :
        newOrderStatus = "COMPLETED" ;
        break ;
      case "cancel" :
        newOrderStatus = "CANCELLED" ;
        break ;
    }

    let dbReturnData = await dbRepository.changeOrderStatus(orderId, newOrderStatus) ;
    if(dbReturnData.status == false){throw dbReturnData ;}
    res.send({
      status : true
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),

      yo : "Beta ji koi error hai"
    }) ;
  }
} ;