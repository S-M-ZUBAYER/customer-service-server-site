const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');

//Require multer for upload different files
const multer =require("multer")

//Require path to view file file according to the path
const path= require("path")

//Require fs to unlink the file at the time to update and delete
const fs = require('fs');

const app=express();
app.use(cors());


// Set the specific folder to show the file
router.use(express.static('public'))

//create the structure to upload the file with specific name
const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname) )
    }
})


//declare the multer
const upload=multer({
    storage:storage
})


//create the route and function to load all the icons according to the category name

router.get('/icons', (req, res) => {
  const category = req.query.categoryName;
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



//create the route and function to load all the categories name

router.get('/categories', (req, res) => {
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


    

//create the route and function to add icons according to the category name

router.post('/icons/add',upload.single("image"),(req,res)=>{
   
    const image=req.file.filename;
    const userEmail=req.body.email;
    const categoryName=req.body.categoryName;
    allInfo=[image,userEmail,categoryName]
    
    const spl="INSERT INTO icons (icon,email,categoryName) VALUES (?)";

    connection.query(spl,[allInfo],(err,result)=>{
        if(err) {
            console.log(err)
           return res.json({message:"error"}); 
        }
        return res.json({status:"success"})
    })

})

   
     
    
//create the route and function to add new category name

    router.put('/categories/add', (req, res)=>{
    
      const categories=req.body;
      const categoriesString=JSON.stringify(categories)
      let sql = `UPDATE allcategoris SET allcategories='${categoriesString}' WHERE id=1`;
      connection.query(sql,categoriesString,  function(err, result){
         if (err) throw err;
         console.log("successfully updated", result);
         res.json(result);;
      });
    });



//create the route and function to delete specific icon according to the id

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
  
//start from here to unlink and delete the file from the folder

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