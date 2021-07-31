const mysql = require('mysql2') ;
require('dotenv').config() ;

/* The reason i created a seperate file is this
 * when we use namedPlaceholders, we pass values to paramaters like this    :email
 * i.e. a COLON followed by a variable name and then we pass that variable in an object with the query.
 * It works like this in this whole project
 *
 * But there is one place where doing this creates a problem, and that is when we are restoring the table data
 * When restoring data, we are copying the data from an sql file.
 * and there are lots of un-escaped colons in the date strings or other strings too.
 * So it causes errors. So that's why this separate file is created and this connection does not use namedPlaceholders.
 */

let user, host, password ;

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
  database : 'restaurant_db',
  password : password,
  dateStrings : true,
  multipleStatements : true

}) ;





module.exports = pool.promise() ;