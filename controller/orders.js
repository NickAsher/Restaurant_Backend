const path = require('path') ;
const fs = require('fs') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const Constants = require('../utils/Constants') ;
const moment = require('moment') ;
const orderParseUtils = require('../utils/order_parse_utils') ;

exports.getOrderPage = async (req, res)=>{
  try{
    let dbReturnData = await dbRepository.getAllOrders_OfToday() ;
    if(dbReturnData.status == false){throw `${dbReturnData.data} : unable to get orders from db` ;}

    let menuNameData = await orderParseUtils.getMenuNameData() ;
    if(menuNameData.status!= true){throw menuNameData.e ;}


    dbReturnData.data.map(row=>{
      row.userDetails = JSON.parse(row.userDetails) ;
      row.address = JSON.parse(row.address) ;
      row.cart =   orderParseUtils.parseCartFromBackendToAdminOrder(menuNameData,  JSON.parse(row.cart)) ;
      row.paymentData = JSON.parse(row.paymentData) ;
      row.datetime = moment(row.datetime).format('h:mm a') ;
    }) ;




    res.render('orders/all_orders.hbs', {
      orderData : dbReturnData.data
    }) ;
    // res.send({
    //   orderData : dbReturnData.data
    // }) ;

  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
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
    if(dbReturnData.status == false){throw dbReturnData.data ;}
    res.send({
      status : true
    }) ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;