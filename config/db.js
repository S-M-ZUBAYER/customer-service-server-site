const mysql=require("mysql");


//create a connection with mysql
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tht-customer-service'
  });

  
  module.exports=connection;