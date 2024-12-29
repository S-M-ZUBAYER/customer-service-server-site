//create a connection with mysql
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'tht-customer-service'
//   });



// console.log(process.env.DBHost,process.env.DBUser,process.env.DBpassword,process.env.DBName,process.env.DBPort)



// const mysql = require("mysql");
// require('dotenv').config();

// //create a connection with mysql
// var connection = mysql.createConnection({
//   host: process.env.DBHost,
//   user: process.env.DBUser,
//   password: process.env.DBpassword,
//   database: process.env.DBName,
//   port: process.env.DBPort
// });

// module.exports = connection;



const mysql = require("mysql");
require("dotenv").config();

// Create a connection pool with MySQL
const pool = mysql.createPool({
  host: process.env.DBHost,
  user: process.env.DBUser,
  password: process.env.DBPassword,
  database: process.env.DBName,
  port: process.env.DBPort,
  connectionLimit: 10, // Maximum number of connections in the pool
  waitForConnections: true, // Queue connection requests if all are in use
  queueLimit: 0, // No limit to the number of queued requests
});


// Export the pool to use in other parts of your application
module.exports = pool;
