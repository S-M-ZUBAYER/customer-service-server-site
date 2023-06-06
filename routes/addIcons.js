const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');
// import multer from "multer";
const multer =require("multer")
// import path from "path";
const path= require("path")
const fs = require('fs');

const app=express();
app.use(cors());
// router.use(express.static('public/images'));
router.use(express.static('public'))

const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname) )
    }
})

const upload=multer({
    storage:storage
})


// router.get('/icons', (req, res) => {
//     const email = req.query.email;
//   console.log(email)
//     // Perform a query to find data by email
//     // const query = `SELECT * FROM icons WHERE email = '${email}'`;
//     const query = `SELECT * FROM icons WHERE email = '${email}'`;
    
//     connection.query(query, (error, results) => {
//       if(results) {
//         res.json(results);
//       }
//     else {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'An error occurred' });
//       } 
//     });
//   });

router.get('/icons', (req, res) => {
 
  const category = req.query.categoryName;
 
    // Perform a query to find data by email
    // const query = `SELECT * FROM icons WHERE email = '${email}'`;
     // Perform a query to find data by email
  const query = `SELECT * FROM icons WHERE categoryName = '${category}'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
  });



  
router.get('/categories', (req, res) => {
 
    // Perform a query to find data by email
    // const query = `SELECT * FROM icons WHERE email = '${email}'`;
    const query = `SELECT * FROM allcategoris WHERE 1`;
    
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


// //part for get and post data for all of the unknown questions
// router.get('/translationsQuestions', (req, res) => {
//   const email = req.query.email;
//   console.log(email)

//   // Perform a query to find data by email
//   const query = `SELECT * FROM translationsquestions WHERE email = '${email}'`;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       res.status(500).json({ error: 'An error occurred' });
//     } else {
//       res.json(results);
//     }
//   });
// });
 


// router.post('/categories/add',(req,res)=>{
//     // INSERT INTO `users`(`id`, `Name`, `image`, `phone`, `country`, `language`, `email`, `designation`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
//     const categories=req.body;
//     const categoriesString=JSON.stringify(categories)
//     let sql="INSERT INTO allcategoris (allcategories) VALUES (?)";
//     connection.query(sql,categoriesString,(err,result)=>{
//         if(err) throw err;
//         console.log("successfully inserted");
//         res.json(result);
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });
    
router.post('/icons/add',upload.single("image"),(req,res)=>{
   
    const image=req.file.filename;
    const userEmail=req.body.email;
    const categoryName=req.body.categoryName;
    allInfo=[image,userEmail,categoryName]
    // const spl="UPDATE icons SET icon=?";
    const spl="INSERT INTO icons (icon,email,categoryName) VALUES (?)";
    connection.query(spl,[allInfo],(err,result)=>{
        if(err) {
            console.log(err)
           return res.json({message:"error"}); 
        }
        return res.json({status:"success"})
    })
})

   
     
    

    router.put('/categories/add', (req, res)=>{
      // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
    
      const categories=req.body;
      const categoriesString=JSON.stringify(categories)
      let sql = `UPDATE allcategoris SET allcategories='${categoriesString}' WHERE id=1`;
      connection.query(sql,categoriesString,  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
      // res.send("<h1>Hello world</h1>");
      // res.status(200).json({"Message": "Success"});
    });




    // let sql = `DELETE FROM players WHERE id=?`;
// router.delete('/icons/delete/:id', (req, res)=>{
//   console.log(req.params.id);

// console.log("Deleted user");
//   const sql = `DELETE FROM icons WHERE id=?`;
//   connection.query(sql, [req.params.id],  function(err, result){
//      if (err) throw err;
//      console.log("successfully Delete", result);
//      res.json(result);
//   });
// });
router.delete('/icons/delete/:id', (req, res) => {
  const iconId = req.params.id;
  

  const sql = `SELECT * FROM icons WHERE id = ?`;
  connection.query(sql, [iconId], function(err, rows) {
    if (err) {
      console.error('Error retrieving icon:', err);
      res.status(500).send('Error retrieving icon');
      return;
    }

    if (rows.length === 0) {
      res.status(404).send('Icon not found');
      return;
    }

    const icon = rows[0];
  
    const filePath = `public/images/${icon.icon}`;
 

    fs.unlink(filePath, function(err) {
      if (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
        return;
      }

      const deleteSql = `DELETE FROM icons WHERE id = ?`;
      connection.query(deleteSql, [iconId], function(err, result) {
        if (err) {
          console.error('Error deleting icon from database:', err);
          res.status(500).send('Error deleting icon from database');
          return;
        }

        console.log('Icon deleted successfully');
        res.json(result);
      });
    });
  });
});


module.exports=router;