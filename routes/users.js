//Require necessary packages

const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');

const app = express();
app.use(cors({
  origin:["http://localhost:3000"],
  method:["GET","POST"],
  credentials:true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
  key:"userId",
  secret:"zubayer",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:60*60*24,
  }

}))

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

router.post('/users/add', (req, res) => {
 
  name = req.body.name,
    image = req.body.image,
    phone = req.body.phone,
    country = req.body.country,
    language = req.body.language,
    email = req.body.email,
    password = req.body.password,
    designation = req.body.designation

    console.log(name)

bcrypt.hash(password,saltRounds,(err,hash)=>{
  if(err){
    console.error(err)
  }
  else{
      let sql = "INSERT INTO users (name, image, phone, country, language, email,password, designation) VALUES (?,?,?,?,?,?,?,?)";

  connection.query(sql, [name, image, phone, country, language, email,hash,designation], (err, result) => {
    if (err) throw err;
    console.log("successfully inserted");
    res.json(result);
  })
  }
})

});


//create this function to check the user email and password

// router.post('/login',(req,res)=>{
//   const email=req.body.email;
//   const password=req.body.password;
//   console.log(email,password)
//   connection.query("SELECT * FROM users WHERE email=?"),
//   [email],
//   (err,result)=>{
//     if(err){
//       res.send({err:err})
//     }
//     if(result.length>0){
//       bcrypt.compare(password,result[0]?.password,(err,response)=>{
// if(response){
//   res.send(result)
// }
// else{
//   res.send({message:"Wrong email/password combination!"});
// }
//       })
//     }
//     else{
//       res.send({message:"User doesn't exist"});
//     }
//   }
// })

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  connection.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0]?.password, (err, response) => {
          if (response) {
            // req.session.user=result;
            // console.log(req.session.user)
            res.send(result);
          } else {
            res.send({ message: "Wrong email/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});



router.post('/check-user', (req, res) => {
  const email = req.body.email;
  

  // Execute SQL query
  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to execute query' });
    } else {
      if (results.length > 0) {
        // User with the given email exists
        res.json({ exists: true });
      } else {
        // User with the given email does not exist
        res.json({ exists: false });
      }
    }
  });
});


//create the route and function to update a specific user information according to the email address

router.put('/users/update/:id', (req, res) => {
  const { name, phone, designation, language, country } = req.body;

  let sql = `UPDATE users SET name='${name}', phone='${phone}', designation='${designation}', language='${language}', country='${country}' WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully updated", result);
    res.json(result);;
  });

});

//create the route and function to update a specific user's admin information according to the email address

router.put('/users/update/admin/:id', (req, res) => {


  const isAdmin = true;
  console.log(isAdmin)
  let sql = `UPDATE users SET isAdmin='${true}' WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully updated", result);
    res.json(result);;
  });

});



//create the route and function to delete a specific user information according to the email address

router.delete('/users/delete/:id', (req, res) => {
  // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
  console.log(req.params.id);


  const sql = `DELETE FROM users WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully Delete", result);
    res.json(result);
  });
});



module.exports = router;