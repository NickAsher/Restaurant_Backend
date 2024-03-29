const mysql = require('mysql2') ;
require('dotenv').config() ;

let user, host, password, dbName ;

if(process.env.NODE_ENV == 'development'){
  host = process.env.DB_HOST ;
  user = process.env.DB_USER ;
  password = process.env.DB_PASSWORD ;
}else if(process.env.NODE_ENV == 'production'){
  host = process.env.DB_HOST_PRODUCTION ;
  user = process.env.DB_USER_PRODUCTION ;
  password = process.env.DB_PASSWORD_PODUCTION ;
}

const pool = mysql.createPool({
  host : host,
  user : user,
  database : "restaurant_db",
  password : password,
  namedPlaceholders : true,
  dateStrings : true,
}) ;





module.exports = pool.promise() ;