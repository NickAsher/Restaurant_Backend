const mysql = require('mysql2') ;

const pool = mysql.createPool({
    host : 'localhost',
    user : 'yolo2',
    database : 'restaurant',
    password : 'yoloyolo',
  namedPlaceholders : true,
  dateStrings : true

}) ;





module.exports = pool.promise() ;