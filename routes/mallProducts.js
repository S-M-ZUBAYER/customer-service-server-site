const express = require("express")
const connection = require("../config/db")
const router = express.Router()
const cors = require("cors");
const fs = require('fs');

// import multer from "multer";
const multer = require("multer")
// import path from "path";
const path = require("path")



// router.use(express.static('public/images'));
router.use(express.static('public'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/mallProductImages')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})


const app = express();
app.use(cors());
// app.use('/uploads', express.static('uploads'));
// app.use("/uploads",express.static("uploads"))


router.get('/mallProducts', (req, res) => {
  connection.query('SELECT * FROM mallproducts', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).send('Error retrieving products');
    } else {
      res.json(results);
    }
  });
});



// router.post('/mallProducts/add',(req,res)=>{
//     // INSERT INTO `mallProducts`(`id`, `productName`,`productPrice`,`productDescription`,`modelNumber`,`printerColor`,`connectorType`,`stockQuantity`,`shelfStartTime`,`shelfEndTime`,`afterSalesText`,`afterSalesInstruction`,`inventoryText`,`invoiceFile`) VALUES ('[value-1]','[value-2]','[value-3]')
//     const allQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allQuestions)
//     let sql="INSERT INTO questions (email,question,date,time) VALUES (?)";
//     connection.query(sql,[allQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });

router.post('/mallProducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFiles' }, { name: 'images' }, { name: 'videos' }]), (req, res) => {
  // router.post('/mallProducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFile' }]), (req, res) => {
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
  console.log(typeof (product.allImages), typeof (product.allVideos),typeof (product.invoiceFiles))


  connection.query('INSERT INTO mallproducts (productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg, invoiceFile, allImages, allVideos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg.filename,invoiceFiles.map((file) => file.filename).join(','), allImages.map((file) => file.filename).join(','), allVideos.map((file) => file.filename).join(',')], (error, results) => {
    if (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Error creating product');
    } else {
      console.log('Product created successfully');
      res.send('Product created successfully');
    }
  });
});



router.put('/mallProducts/update/:id', upload.fields([{ name: 'productImg' }, { name: 'invoiceFile' }, { name: 'images' }, { name: 'videos' }]), (req, res)=>{
  

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
  console.log(typeof (product.allImages), typeof (product.allVideos))

  let sql = `UPDATE mallproducts SET productName='${productName}', productPrice='${productPrice}', productDescription='${productDescription}',modelNumber='${modelNumber}', printerColor='${printerColor}', connectorType='${connectorType}', stockQuantity='${stockQuantity}',shelfStartTime='${shelfStartTime}', shelfEndTime='${shelfEndTime}', afterSalesText='${afterSalesText}',  afterSalesInstruction='${afterSalesInstruction}',inventoryText='${inventoryText}', productImg='${productImg.filename}', invoiceFile='${invoiceFiles}', allImages='${allImages.map((file) => file.filename).join(',')}',allVideos='${allVideos.map((file) => file.filename).join(',')}' WHERE id=?`;
  connection.query(sql, [req.params.id],  function(err, result){
     if (err) throw err;
     console.log("successfully updated", result);
     res.json(result);;
  });
 
});



    // let sql = `DELETE FROM mallproducts WHERE id=?`;
    // router.delete('/mallProducts/delete/:id', (req, res)=>{
  
    
    
    //   const sql = `DELETE FROM mallproducts WHERE id=?`;
    //   connection.query(sql, [req.params.id],  function(err, result){
    //      if (err) throw err;
    //      console.log("successfully Delete", result);
    //      res.json(result);
    //   });
    // });

  

router.delete('/mallProducts/delete/:id', (req, res) => {
  const productId = req.params.id;

  const sql = `SELECT * FROM mallproducts WHERE id = ?`;
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
    console.log(product)

     // Delete associated main images
    const imgFilePath = `public/mallProductImages/${product.productImg}`;
    fs.unlink(imgFilePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });

    // Delete associated images
    const imageFiles = (product.allImages).split(",") || [];

    imageFiles.forEach((filename) => {
      const filePath = `public/mallProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    });

    // Delete associated videos
    const videoFiles = (product.allVideos).split(",") || [];
    videoFiles.forEach((filename) => {
      const filePath = `public/mallProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting video file:', err);
        }
      });
    });

    // Delete associated files
    const invoiceFiles = (product.invoiceFile).split(",") || [];
  
    invoiceFiles.forEach((filename) => {
      const filePath = `public/mallProductImages/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting video file:', err);
        }
      });
    });

    const deleteSql = `DELETE FROM mallproducts WHERE id = ?`;
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






// //part for get and post data for all of the unknown questions
// router.get('/unknownQuestions', (req, res) => {
//     const email = req.query.email;

//     // Perform a query to find data by email
//     const query = `SELECT * FROM unknownquestions WHERE email = '${email}'`;

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'An error occurred' });
//       } else {
//         res.json(results);
//       }
//     });
//   });



// router.post('/unknownQuestions/add',(req,res)=>{
//     // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
//     const allUnknownQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allUnknownQuestions)
//     let sql="INSERT INTO unknownquestions (email,question,date,time) VALUES (?)";
//     connection.query(sql,[allUnknownQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("Unknown successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });




// //part for get and post data for all of the unknown questions
// router.get('/translationsQuestions', (req, res) => {
//     const email = req.query.email;
//     console.log(email)

//     // Perform a query to find data by email
//     const query = `SELECT * FROM translationsquestions WHERE email = '${email}'`;

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'An error occurred' });
//       } else {
//         res.json(results);
//       }
//     });
//   });



// router.post('/translationsQuestions/add',(req,res)=>{
//     // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
//     const allTranslationsQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.english,
//         req.body.bangla,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allTranslationsQuestions)
//     let sql="INSERT INTO translationsquestions (email,question,english,bangla,date,time) VALUES (?)";
//     connection.query(sql,[allTranslationsQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("Translations questions successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });



module.exports = router;