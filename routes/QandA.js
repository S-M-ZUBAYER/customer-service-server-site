const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');

const app=express();
app.use(cors());




router.get('/QandAnswers', (req, res) => {
    const email = req.query.email;
  console.log(email)
    // Perform a query to find data by email
    // const query = `SELECT * FROM questionanswers WHERE email = '${email}'`;
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

 


router.post('/QandAnswers/add',(req,res)=>{
    // INSERT INTO `users`(`id`, `Name`, `image`, `phone`, `country`, `language`, `email`, `designation`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
    const QandA=[
        req.body.email,
        req.body.question,
        req.body.answer
    ]
    let sql="INSERT INTO questionanswers (email,question, answer) VALUES (?)";
    connection.query(sql,[QandA],(err,result)=>{
        if(err) throw err;
        console.log("successfully inserted");
        res.json(result);
    })
    // res.send("THT-Space Electrical Company Ltd Sever Running")
    // res.status(200).json({"message":"Success"});
    });
    

   
     
    

    router.put('/QandAnswers/update/:id', (req, res)=>{
      // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
    
    console.log("update user");
    
      const {email,question,answer,date,time} = req.body;
      console.log(email,question,answer,date,time);
      let sql = `UPDATE questionanswers SET email='${email}', question='${question}', answer='${answer}',date='${date}', time='${time}' WHERE id=?`;
      connection.query(sql, [req.params.id],  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
      // res.send("<h1>Hello world</h1>");
      // res.status(200).json({"Message": "Success"});
    });




    // let sql = `DELETE FROM players WHERE id=?`;
router.delete('/QandAnswers/delete/:id', (req, res)=>{
  // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
  console.log(req.params.id);

console.log("Deleted user");
  const sql = `DELETE FROM questionanswers WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully Delete", result);
     res.json(result);
  });
});



module.exports=router;