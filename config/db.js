const mysql=require("mysql");
require('dotenv').config();


//create a connection with mysql
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'tht-customer-service'
//   });
  
//create a connection with mysql
var connection = mysql.createConnection({
    host     : process.env.DBHost,
    user     : process.env.DBUser,
    password : '',
    database : process.env.DBName
  });

  
  module.exports=connection;