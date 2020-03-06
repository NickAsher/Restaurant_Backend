const mysql = require('mysql2') ;

const pool = mysql.createPool({
    host : 'localhost',
    user : 'yolo2',
    database : 'my_database',
    password : 'yoloyolo',
  namedPlaceholders : true,
  dateStrings : true

}) ;





module.exports = pool.promise() ;