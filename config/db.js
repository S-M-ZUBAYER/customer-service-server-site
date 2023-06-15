const mysql = require("mysql");
require('dotenv').config();


//create a connection with mysql
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'tht-customer-service'
//   });
console.log(process.env.DBHost,process.env.DBUser,process.env.DBpassword,process.env.DBName,process.env.DBPort)
//create a connection with mysql
var connection = mysql.createConnection({
  host: process.env.DBHost,
  user: process.env.DBUser,
  password: process.env.DBpassword,
  database: process.env.DBName,
  port: process.env.DBPort
});


module.exports = connection;