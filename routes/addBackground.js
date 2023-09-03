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
        cb(null,'public/backgroundImgs')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname) )
    }
})


//declare the multer
const upload=multer({
    storage:storage
})


//create the route and function to load all the backgrounds according to the category name

router.get('/backgroundImgs/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName; // Correctly access the categoryName parameter
    console.log(categoryName);
    const query = 'SELECT * FROM backgroundImgs WHERE categoryName = ?';
  
    connection.query(query, [categoryName], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });
  



//create the route and function to load all the categories name


router.get('/BackgroundCategories', (req, res) => {

    const query = `SELECT * FROM allbackgroundcategoris WHERE 1`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });

  router.get('/allBackgroundImgs', (req, res) => {
    console.log("backgrounds")
    const query = `SELECT * FROM backgrounds WHERE 1`;
    
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

router.post('/backgroundImgs/add', upload.array("images"), (req, res) => {
    console.log("connect")
  const images = req.files.map((file) => file.filename);
  const userEmail = req.body.email;
  const categoryName = req.body.categoryName;
console.log(images,userEmail,categoryName)
  const insertData = images.map((image) => [image, userEmail, categoryName]);

  const sql = "INSERT INTO backgroundImgs (image, userEmail, categoryName) VALUES ?";
  
  connection.query(sql, [insertData], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ message: "error" });
    }
    return res.json({ status: "success" });
  });
});


   
     
    
router.post('/BackgroundCategories/add', (req, res) => {
    const { categoryName } = req.body;
  console.log(categoryName)
    const sql = 'INSERT INTO allbackgroundcategoris (allBackgroundCategoris) VALUES (?)';
  
    connection.query(sql, [categoryName], (err, result) => {
      if (err) {
        console.error('Error adding category to the database:', err);
        res.status(500).json({ message: 'Error adding category' });
        return;
      }
      console.log('Category added to the database');
      res.status(201).json({ message: 'Category added successfully' });
    });
  });


//create the route and function to delete specific icon according to the id

router.delete('/backgroundImgs/delete/:id', (req, res) => {
  const iconId = req.params.id;
  console.log(iconId)
  
  const sql = `SELECT * FROM backgroundimgs WHERE id = ?`;
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

    const filePath = `public/backgroundImgs/${icon.image}`;
 

    fs.unlink(filePath, function(err) {
      if (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
        return;
      }

      const deleteSql = `DELETE FROM backgroundImgs WHERE id = ?`;
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