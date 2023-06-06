const express=require("express")
const connection=require("../config/db")
const router=express.Router()
const cors = require("cors");

const app=express();
app.use(cors())


//part for get and post data for all of the questions
router.get('/questions', (req, res) => {
    const email = req.query.email;
  
    // Perform a query to find data by email
    const query = `SELECT * FROM questions WHERE email = '${email}'`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });

//create a route to delete all questions from database according to the user
  router.delete('/questions/delete/:email', (req, res) => {
    const email = req.params.email;
  
    const deleteSql = 'DELETE FROM questions WHERE email = ?';
  
    connection.query(deleteSql, [email], (error, result) => {
      if (error) {
        console.error('Error deleting questions:', error);
        res.status(500).send('Error deleting questions');
        return;
      }
  
      console.log('Questions deleted successfully');
      res.json(result);
    });
  });
  

//create a route to delete all unknown questions from database according to the user

  router.delete('/unknownQuestions/delete/:email', (req, res) => {
    const email = req.params.email;
  
    const deleteSql = 'DELETE FROM unknownquestions WHERE email = ?';
  
    connection.query(deleteSql, [email], (error, result) => {
      if (error) {
        console.error('Error deleting questions:', error);
        res.status(500).send('Error deleting questions');
        return;
      }
  
      console.log('Questions deleted successfully');
      res.json(result);
    });
  });


  //create a route to delete a unknown questions from database according to the user

  router.delete('/unknownQuestions/deleteById/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
  
    const deleteSql = 'DELETE FROM unknownquestions WHERE id = ?';
  
    connection.query(deleteSql, [id], (error, result) => {
      if (error) {
        console.error('Error deleting questions:', error);
        res.status(500).send('Error deleting questions');
        return;
      }
  
      console.log('Questions deleted successfully');
      res.json(result);
    });
  });



//create a route to delete all unknown questions from database according to the user

  router.delete('/translateData/delete/:email', (req, res) => {
    const email = req.params.email;
  
    const deleteSql = 'DELETE FROM translationsquestions WHERE email = ?';
  
    connection.query(deleteSql, [email], (error, result) => {
      if (error) {
        console.error('Error deleting questions:', error);
        res.status(500).send('Error deleting questions');
        return;
      }
  
      console.log('Questions deleted successfully');
      res.json(result);
    });
  });

   //create a route to delete a unknown questions from database according to the user

   router.delete('/translationQuestions/deleteById/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
  
    const deleteSql = 'DELETE FROM translationsquestions WHERE id = ?';
  
    connection.query(deleteSql, [id], (error, result) => {
      if (error) {
        console.error('Error deleting questions:', error);
        res.status(500).send('Error deleting questions');
        return;
      }
  
      console.log('Questions deleted successfully');
      res.json(result);
    });
  });
  


router.post('/questions/add',(req,res)=>{
    // INSERT INTO `questions`(`id`, `question`,`email`) VALUES ('[value-1]','[value-2]','[value-3]')
    const allQuestions=[
        req.body.email,
        req.body.question,
        req.body.date,
        req.body.time,

    ]
    console.log(allQuestions)
    let sql="INSERT INTO questions (email,question,date,time) VALUES (?)";
    connection.query(sql,[allQuestions],(err,result)=>{
        if(err) throw err;
        console.log("successfully inserted");
        res.json(result);
        // res.redirect("/users")
    })
    // res.send("THT-Space Electrical Company Ltd Sever Running")
    // res.status(200).json({"message":"Success"});
    });

    



//part for get and post data for all of the unknown questions
router.get('/unknownQuestions', (req, res) => {
    const email = req.query.email;
  
    // Perform a query to find data by email
    const query = `SELECT * FROM unknownquestions WHERE email = '${email}'`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });



router.post('/unknownQuestions/add',(req,res)=>{
    // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
    const allUnknownQuestions=[
        req.body.email,
        req.body.question,
        req.body.date,
        req.body.time,

    ]
    console.log(allUnknownQuestions)
    let sql="INSERT INTO unknownquestions (email,question,date,time) VALUES (?)";
    connection.query(sql,[allUnknownQuestions],(err,result)=>{
        if(err) throw err;
        console.log("Unknown successfully inserted");
        res.json(result);
        // res.redirect("/users")
    })
    // res.send("THT-Space Electrical Company Ltd Sever Running")
    // res.status(200).json({"message":"Success"});
    });




//part for get and post data for all of the unknown questions
router.get('/translationsQuestions', (req, res) => {
    const email = req.query.email;
    console.log(email)
  
    // Perform a query to find data by email
    const query = `SELECT * FROM translationsquestions WHERE email = '${email}'`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });



router.post('/translationsQuestions/add',(req,res)=>{
    // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
    const allTranslationsQuestions=[
        req.body.email,
        req.body.question,
        req.body.english,
        req.body.bangla,
        req.body.date,
        req.body.time,

    ]
    console.log(allTranslationsQuestions)
    let sql="INSERT INTO translationsquestions (email,question,english,bangla,date,time) VALUES (?)";
    connection.query(sql,[allTranslationsQuestions],(err,result)=>{
        if(err) throw err;
        console.log("Translations questions successfully inserted");
        res.json(result);
        // res.redirect("/users")
    })
    // res.send("THT-Space Electrical Company Ltd Sever Running")
    // res.status(200).json({"message":"Success"});
    });



module.exports=router;