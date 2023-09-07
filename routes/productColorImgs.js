//Require necessary packages

const express = require("express")
const connection = require("../config/db")
const router = express.Router()
const cors = require("cors");
const fs = require('fs');

// import multer from "multer" to upload file in backend
const multer = require("multer") 

// import path from "path" to get the specific path of any file
const path = require("path");
const { route } = require("./users");



// Set the specific folder to show the file
router.use(express.static('public'))


//create the structure to upload the file with specific name

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/colorImages')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})


//declare the multer

const upload = multer({
  storage: storage
})


const app = express();
app.use(cors());


router.post('/colorImg/add', upload.single('colorImage'), (req, res) => {
    // Extract other data from the request body

    const {
        productId,
        modelNumber,
        colorName,
        typeName,
        productPrice,
        stockQuantity,
        productDescription
      } = req.body;
    
      // Check if there is an uploaded file
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No color image uploaded' });
      }
   
      // Extract the uploaded file
      const colorImage = req.file; // Removed [0]
      
      // Construct the data to be inserted into the database
      const colorImageData = {
        productId,
        modelNumber,
        colorName,
        typeName,
        productPrice,
        stockQuantity,
        productDescription,
        colorImage: colorImage ? colorImage.filename : null // Use the filename of the uploaded image
      };
  
    // Insert the data into the database
    connection.query(
      'INSERT INTO allcolorimages (productId,modelNumber,colorName,typeName,colorProductPrice,colorProductQuantity,colorProductDescription,colorImage,imgPath) VALUES (?,?,?,?,?,?, ?, ?, ?)',
      [
        productId,
        modelNumber,
        colorName,
        typeName,
        productPrice,
        stockQuantity,
        productDescription,
        colorImage.filename,
        'https://grozziie.zjweiting.com:8033/tht/colorImages'
      ],
      (error, results) => {
        if (error) {
          console.error('Error creating color image:', error);
          res.status(500).json({ status: 'error', message: 'Error creating color image' });
        } else {
          console.log('Color image created successfully');
          res.status(200).json({ status: 'success', message: 'Color image created successfully' });
        }
      }
    );
  });
  
  
  router.delete('/colorImgs/delete/:id', (req, res) => {
    const colorId = req.params.id;
    console.log(colorId)
    
    const sql = `SELECT * FROM allcolorimages WHERE productId = ?`;
    connection.query(sql, [colorId], function(err, rows) {
      if (err) {
        console.error('Error retrieving colorImg:', err);
        res.status(500).send('Error retrieving colorImg');
        return;
      }
  
      if (rows.length === 0) {
        res.status(404).send('colorImg not found');
        return;
      }
  
      const icon = rows[0];
    
  //start from here to unlink and delete the file from the folder
  
      const filePath = `public/colorImages/${icon.colorImage}`;
   
  
      fs.unlink(filePath, function(err) {
        if (err) {
          console.error('Error deleting file:', err);
          res.status(500).send('Error deleting file');
          return;
        }
  
        const deleteSql = `DELETE FROM allcolorimages WHERE productId = ?`;
        connection.query(deleteSql, [colorId], function(err, result) {
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
  




module.exports = router;