//Require necessary packages

const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');

const app=express();
app.use(cors());


//create the route and function to got all user information from database

router.get('/allUsers', (req, res) => {
  
    const query = `SELECT * FROM users WHERE 1`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });


  //create the route and function to get the specific user information according to their email
router.get('/users', (req, res) => {
    const email = req.query.email;
  
    // Perform a query to find data by email
    const query = `SELECT * FROM users WHERE email = '${email}'`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });

 

//create the route and function to add user in database at the time to register their new account

router.post('/users/add',(req,res)=>{
    const user=[
        req.body.name,
        req.body.image,
        req.body.phone,
        req.body.country,
        req.body.language,
        req.body.email,
        req.body.designation
    ]
    let sql="INSERT INTO users (name, image, phone, country, language, email, designation) VALUES (?)";

    connection.query(sql,[user],(err,result)=>{
        if(err) throw err;
        console.log("successfully inserted");
        res.json(result);
    })
  
    });
    

    
     
    
//create the route and function to update a specific user information according to the email address

    router.put('/users/update/:id', (req, res)=>{
    
    
    
      const {name,phone,designation,language,country} = req.body;
     
      let sql = `UPDATE users SET name='${name}', phone='${phone}', designation='${designation}', language='${language}', country='${country}' WHERE id=?`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
   
    });

//create the route and function to update a specific user's admin information according to the email address

    router.put('/users/update/admin/:id', (req, res)=>{
  
    
      const isAdmin = true;
      console.log(isAdmin)
      let sql = `UPDATE users SET isAdmin='${true}' WHERE id=?`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
   
    });



//create the route and function to delete a specific user information according to the email address
  
router.delete('/users/delete/:id', (req, res)=>{
  // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
  console.log(req.params.id);


  const sql = `DELETE FROM users WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully Delete", result);
     res.json(result);
  });
});



module.exports=router;