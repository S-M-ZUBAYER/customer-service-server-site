//Require necessary packages

const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');
const requestIP = require('request-ip');

const app=express();
app.use(cors());



//create the route and function to get the the Question Answer store according to the email address

router.get('/QandAnswers', (req, res) => {
    const email = req.query.email;

    const query = `SELECT * FROM questionanswers WHERE email = '${email}'`;
    
    connection.query(query, (error, results) => {
      if(results) {
        res.json(results);
      }
    else {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } 
    });
  });

 

//create the route and function to add new Question answer according to email address

router.post('/QandAnswers/add',(req,res)=>{
   
    const QandA=[
        req.body.email,
        req.body.question,
        req.body.answer,
        req.body.date,
        req.body.time
    ]
    let sql="INSERT INTO questionanswers (email,question, answer,date,time) VALUES (?)";
    connection.query(sql,[QandA],(err,result)=>{
        if(err) throw err;
        console.log("successfully inserted");
        res.json(result);
    })
    
    });
    

   
     
    
//create the route and function to update Question answer according to email address

    router.put('/QandAnswers/update/:id', (req, res)=>{
    
    console.log("update user");
    
      const {email,question,answer,date,time} = req.body;
      
      let sql = `UPDATE questionanswers SET email='${email}', question='${question}', answer='${answer}',date='${date}', time='${time}' WHERE id=?`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
     
    });


//create the route and make api to update about, date, time

    router.put('/about/update', (req, res)=>{
    
      const {about,date,time} = req.body;
      
      let sql = `UPDATE about SET about='${about}',date='${date}', time='${time}' WHERE id=1`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("About information successfully updated", result);
         res.json(result);;
      });
     
    });


    //create the route and function to get the about information 
    router.get('/about', (req, res) => {
      const id = req.params.id;
    
      const query = `SELECT * FROM about WHERE id = 1`;
      
      connection.query(query, (error, results) => {
        if (results && results.length > 0) {
          res.json(results);
        } else {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'An error occurred or no results found' });
        } 
      });
    });
    


//create the route and make api to update about, date, time

    router.put('/helpCenter/update', (req, res)=>{
    
      const {helpCenter,date,time} = req.body;
      
      let sql = `UPDATE helpCenter SET helpCenter='${helpCenter}',date='${date}', time='${time}' WHERE id=1`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("Help Center information successfully updated", result);
         res.json(result);;
      });
     
    });

//create the route and function to get the about information 
router.get('/helpCenter', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM helpCenter WHERE id = 1`;
  
  connection.query(query, (error, results) => {
    if (results && results.length > 0) {
      res.json(results);
    } else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred or no results found' });
    } 
  });
});


//create the route and make api to Help Center about, date, time

    router.put('/businessCooperation/update', (req, res)=>{
    
      const {businessCooperation,date,time} = req.body;
      let sql = `UPDATE businessCooperation SET businessCooperation='${businessCooperation}',date='${date}', time='${time}' WHERE id=1`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("Business Cooperation information successfully updated", result);
         res.json(result);;
      });
     
    });

//create the route and function to get the Business Cooperation information 
router.get('/businessCooperation', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM businessCooperation WHERE id = 1`;
  
  connection.query(query, (error, results) => {
    if (results && results.length > 0) {
      res.json(results);
    } else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred or no results found' });
    } 
  });
});


//create the route and function to add delete specific Question answer according to the id
    
router.delete('/QandAnswers/delete/:id', (req, res)=>{
  const sql = `DELETE FROM questionanswers WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully Delete", result);
     res.json(result);
  });
});

router.get('/detectIP',function(req, res) {
  const parseIp = (req) =>
  req.headers['x-forwarded-for']?.split(',').shift()
  || req.socket?.remoteAddress

console.log(parseIp(req))
  const ipAddress = requestIP.getClientIp(req);
  res.send(ipAddress)
});




module.exports=router;