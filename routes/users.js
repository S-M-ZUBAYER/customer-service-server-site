const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');

const app=express();
app.use(cors());


router.get('/allUsers', (req, res) => {
  
  
    // Perform to get all data
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

 


router.post('/users/add',(req,res)=>{
    // INSERT INTO `users`(`id`, `Name`, `image`, `phone`, `country`, `language`, `email`, `designation`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
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
    // res.send("THT-Space Electrical Company Ltd Sever Running")
    // res.status(200).json({"message":"Success"});
    });
    

    // router.delete('/users/:id', async (req, res) => {
    //   const userId = req.params.id;
      
    //   try {
    //     console.log(userId)
     
    

    router.put('/users/update/:id', (req, res)=>{
      // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
    
    console.log("update user");
    
      const {name,phone,designation,language,country} = req.body;
      console.log(name,phone,designation,language,country);
      let sql = `UPDATE users SET name='${name}', phone='${phone}', designation='${designation}', language='${language}', country='${country}' WHERE id=?`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
      // res.send("<h1>Hello world</h1>");
      // res.status(200).json({"Message": "Success"});
    });




    // let sql = `DELETE FROM players WHERE id=?`;
router.delete('/users/delete/:id', (req, res)=>{
  // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
  console.log(req.params.id);

console.log("Deleted user");
  const sql = `DELETE FROM users WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully Delete", result);
     res.json(result);
  });
});



module.exports=router;