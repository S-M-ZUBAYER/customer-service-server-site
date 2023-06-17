//Require necessary packages

const express = require("express")
const connection = require("../config/db")
const router = express.Router()
const cors = require("cors");
const fs = require('fs');


// import multer from "multer" to upload file in backend
const multer = require("multer")


// import path from "path" to get the specific path of any file
const path = require("path")



// Set the specific folder to show the file

router.use(express.static('public'))


//create the structure to upload the file with specific name

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/eventProductImages')
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



//create the route and function to load all the event product

router.get('/eventProducts', (req, res) => {
  connection.query('SELECT * FROM eventproducts', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).send('Error retrieving products');
    } else {
      res.json(results);
    }
  });
});



//create the route and function to add all the information of mall product to store in database 

router.post('/eventProducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFiles' }, { name: 'images' }, { name: 'videos' }]), (req, res) => {
 
  // get the data from frontend
  
  const {
    productName,
    productPrice,
    productDescription,
    modelNumber,
    printerColor,
    connectorType,
    stockQuantity,
    shelfStartTime,
    shelfEndTime,
    afterSalesText,
    afterSalesInstruction,
    inventoryText,
  date,
  time
  } = req.body;

  const productImg = req.files['productImg'][0];
 
  

//create a object for all available data

  const product = {
    productName,
    productPrice,
    productDescription,
    modelNumber,
    printerColor,
    connectorType,
    stockQuantity,
    shelfStartTime,
    shelfEndTime,
    afterSalesText,
    afterSalesInstruction,
    inventoryText,
    date,
    time,
    productImg: productImg.filename,

  };
  const allImages = req.files['images'];
  const allVideos = req.files['videos'];
  const invoiceFiles = req.files['invoiceFiles'];

  if (invoiceFiles && invoiceFiles.length > 0) {
    product.invoiceFiles = invoiceFiles.map((file) => file.filename);
  }
  // Check if files are present
  if (allImages && allImages.length > 0) {
    product.allImages = allImages.map((file) => file.filename);
  }

  if (allVideos && allVideos.length > 0) {
    product.allVideos = allVideos.map((file) => file.filename);
  }
  console.log(typeof (product.allImages), typeof (product.allVideos),typeof (product.invoiceFiles),date,time)


  connection.query('INSERT INTO eventproducts (productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg, invoiceFile, allImages, allVideos,date,time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)', [productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg.filename,invoiceFiles.map((file) => file.filename).join(','), allImages.map((file) => file.filename).join(','), allVideos.map((file) => file.filename).join(','),date,time], (error, results) => {
    if (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Error creating product');
    } else {
      console.log('Product created successfully');
      res.send('Product created successfully');
    }
  });
});


//create the route and function to update a specific event product information

router.put('/eventProducts/update/:id', upload.fields([{ name: 'productImg' }, { name: 'invoiceFile' }, { name: 'images' }, { name: 'videos' }]), (req, res)=>{
  

  const {
    productName,
    productPrice,
    productDescription,
    modelNumber,
    printerColor,
    connectorType,
    stockQuantity,
    shelfStartTime,
    shelfEndTime,
    afterSalesText,
    afterSalesInstruction,
    inventoryText
  } = req.body;

  const productImg = req.files['productImg'][0];
  const invoiceFiles = req.files['invoiceFile'][0];


  const product = {
    productName,
    productPrice,
    productDescription,
    modelNumber,
    printerColor,
    connectorType,
    stockQuantity,
    shelfStartTime,
    shelfEndTime,
    afterSalesText,
    afterSalesInstruction,
    inventoryText,
    productImg: productImg.filename,
    invoiceFile: invoiceFile.filename,

  };
  const allImages = req.files['images'];
  const allVideos = req.files['videos'];

  // Check if files are present
  if (allImages && allImages.length > 0) {
    product.allImages = allImages.map((file) => file.filename);
  }

  if (allVideos && allVideos.length > 0) {
    product.allVideos = allVideos.map((file) => file.filename);
  }
 

  let sql = `UPDATE eventproducts SET productName='${productName}', productPrice='${productPrice}', productDescription='${productDescription}',modelNumber='${modelNumber}', printerColor='${printerColor}', connectorType='${connectorType}', stockQuantity='${stockQuantity}',shelfStartTime='${shelfStartTime}', shelfEndTime='${shelfEndTime}', afterSalesText='${afterSalesText}',  afterSalesInstruction='${afterSalesInstruction}',inventoryText='${inventoryText}', productImg='${productImg.filename}', invoiceFile='${invoiceFiles}', allImages='${allImages.map((file) => file.filename).join(',')}',allVideos='${allVideos.map((file) => file.filename).join(',')}' WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully updated", result);
     res.json(result);;
  });
 
});



  

//create the route and function to delete a mall product according to the id

router.delete('/eventProducts/delete/:id', (req, res) => {
  const productId = req.params.id;

  const sql = `SELECT * FROM eventproducts WHERE id = ?`;
  connection.query(sql, [productId], function(err, rows) {
    if (err) {
      console.error('Error retrieving mall product:', err);
      res.status(500).send('Error retrieving mall product');
      return;
    }

    if (rows.length === 0) {
      res.status(404).send('Mall product not found');
      return;
    }

    const product = rows[0];
  

     // Delete associated main images
    const imgFilePath = `public/eventProductImages/${product.productImg}`;
    fs.unlink(imgFilePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });

    // Delete associated images
    const imageFiles = (product.allImages).split(",") || [];

    imageFiles.forEach((filename) => {
      const filePath = `public/eventProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    });

    // Delete associated videos
    const videoFiles = (product.allVideos).split(",") || [];
    videoFiles.forEach((filename) => {
      const filePath = `public/eventProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting video file:', err);
        }
      });
    });

    // Delete associated files
    const invoiceFiles = (product.invoiceFile).split(",") || [];
  
    invoiceFiles.forEach((filename) => {
      const filePath = `public/eventProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting video file:', err);
        }
      });
    });

    const deleteSql = `DELETE FROM eventproducts WHERE id = ?`;
    connection.query(deleteSql, [productId], function(err, result) {
      if (err) {
        console.error('Error deleting mall product from database:', err);
        res.status(500).send('Error deleting mall product from database');
        return;
      }

      console.log('Mall product deleted successfully');
      res.json(result);
    });
  });
});





module.exports = router;