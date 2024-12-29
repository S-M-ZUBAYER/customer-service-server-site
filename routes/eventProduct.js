// const express = require("express")
// const connection = require("../config/db")
// const router = express.Router()
// const cors = require("cors");
// const fs = require('fs');
// const app = express();
// app.use(cors());

// // import multer from "multer" to upload file in backend
// const multer = require("multer")

// // import path from "path" to get the specific path of any file
// const path = require("path")

// // Set the specific folder to show the file
// router.use(express.static('public'))

// //create the structure to upload the file with specific name
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/eventProductImages')
//   },
//   filename: (req, file, cb) => {
//     const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
//     cb(null, file.fieldname + "_" + Date.now() + randomDigits + path.extname(file.originalname))
//   }
// })
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// //declare the multer
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 100 * 1024 * 1024 }
// });


// router.get('/eventProducts', (req, res) => {
//   connection.query('SELECT * FROM eventproducts', (error, results) => {
//     if (error) {
//       console.error('Error retrieving products:', error);
//       return res.status(500).send('Error retrieving products');
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/eventProducts/slideImageSearch', (req, res) => {
//   const { slideImageMark } = req.body;
//   connection.query(
//     'SELECT * FROM eventproducts WHERE slideImageMark = ?',
//     [slideImageMark],
//     (error, results) => {
//       if (error) {
//         console.error('Error retrieving products:', error);
//         return res.status(500).send('Error retrieving products');
//       }
//       res.json(results.length > 0 ? results : []);
//     }
//   );
// });


// router.get('/eventProducts/:productName', (req, res) => {
//   const productName = req.params.productName;
//   const query = 'SELECT * FROM eventproducts WHERE productName = ?';
//   connection.query(query, [productName], (error, results) => {
//     if (error) {
//       console.error('Error retrieving products:', error);
//       return res.status(500).send('Error retrieving products');
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/eventProducts/region/:productName/:productCountryName', (req, res) => {
//   const { productName, productCountryName } = req.params;
//   const query = 'SELECT * FROM eventproducts WHERE productName = ? AND productCountryName = ?';
//   connection.query(query, [productName, productCountryName], (error, results) => {
//     if (error) {
//       console.error('Error retrieving products:', error);
//       return res.status(500).send('Error retrieving products');
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/eventProducts/country/:productCountryName', (req, res) => {
//   const productCountryName = req.params.productCountryName;
//   const query = 'SELECT * FROM eventproducts WHERE productCountryName = ?';
//   connection.query(query, [productCountryName], (error, results) => {
//     if (error) {
//       console.error('Error retrieving products:', error);
//       return res.status(500).send('Error retrieving products');
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.post('/eventProducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFiles' }, { name: 'images' }, { name: 'descriptionImages' }, { name: 'videos' }, { name: 'instructionsImages' }, { name: 'instructionsVideos' }]), (req, res) => {
//   const {
//     productCountryName,
//     productName,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     productImgLink,
//     productImgRemark,
//     relatedImgLink,
//     relatedImgRemark,
//     descriptionImgRemark,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//     date,
//     time,
//     link,
//     mark,
//     slideImageMark
//   } = req.body;

//   const productImgFile = req.files['productImg'];
//   const productImg = productImgFile ? productImgFile[0] : null;
//   const imgPath = 'https://grozziieget.zjweiting.com:8033/tht/eventProductImages'

//   const product = {
//     productCountryName,
//     productName,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     imgPath,
//     productImgLink,
//     productImgRemark,
//     relatedImgLink,
//     relatedImgRemark,
//     descriptionImgRemark,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//     productImg: productImg ? productImg.filename : null,
//     date,
//     time,
//     link,
//     mark,
//     slideImageMark
//   };

//   const allImages = req.files['images'];
//   const allDescriptionImages = req.files['descriptionImages'];
//   const allVideos = req.files['videos'];
//   const allInstructionsImages = req.files['instructionsImages'];
//   const allInstructionsVideos = req.files['instructionsVideos'];
//   const invoiceFiles = req.files['invoiceFiles'];

//   if (invoiceFiles && invoiceFiles.length > 0) {
//     product.invoiceFiles = invoiceFiles.map((file) => file.filename);
//   }
//   // Check if files are present
//   if (allImages && allImages.length > 0) {
//     product.allImages = allImages.map((file) => file.filename);
//   }

//   if (allDescriptionImages && allDescriptionImages.length > 0) {
//     product.allDescriptionImages = allDescriptionImages.map((file) => file.filename);
//   }

//   if (allVideos && allVideos.length > 0) {
//     product.allVideos = allVideos.map((file) => file.filename);
//   }

//   // Check if files are present
//   if (allInstructionsImages && allInstructionsImages.length > 0) {
//     product.allInstructionsImages = allInstructionsImages.map((file) => file.filename);
//   }

//   if (allInstructionsVideos && allInstructionsVideos.length > 0) {
//     product.allInstructionsVideos = allInstructionsVideos.map((file) => file.filename);
//   }

//   connection.query(
//     'INSERT INTO eventproducts (productCountryName, productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity,imgPath, productImgLink, productImgRemark, relatedImgLink, relatedImgRemark,descriptionImgRemark, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg, invoiceFile, allImages,allDescriptionImages, allVideos, allInstructionsImage, allInstructionsVideos, date, time,link,mark,slideImageMark) VALUES (?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)',
//     [
//       productCountryName,
//       productName,
//       productPrice,
//       productDescription,
//       modelNumber,
//       printerColor,
//       connectorType,
//       stockQuantity,
//       imgPath,
//       productImgLink,
//       productImgRemark,
//       relatedImgLink,
//       relatedImgRemark,
//       descriptionImgRemark,
//       shelfStartTime,
//       shelfEndTime,
//       afterSalesText,
//       afterSalesInstruction,
//       inventoryText,
//       productImg.filename,
//       invoiceFiles && Array.isArray(invoiceFiles) ? invoiceFiles.map((file) => file.filename).join(',') : null,
//       allImages && Array.isArray(allImages) ? allImages.map((file) => file.filename).join(',') : null,
//       allDescriptionImages && Array.isArray(allDescriptionImages) ? allDescriptionImages.map((file) => file.filename).join(',') : null,
//       allVideos && Array.isArray(allVideos) ? allVideos.map((file) => file.filename).join(',') : null,
//       allInstructionsImages && Array.isArray(allInstructionsImages) ? allInstructionsImages.map((file) => file.filename).join(',') : null,
//       allInstructionsVideos && Array.isArray(allInstructionsVideos) ? allInstructionsVideos.map((file) => file.filename).join(',') : null,
//       date,
//       time,
//       link,
//       mark,
//       slideImageMark
//     ],
//     (error, results) => {
//       if (error) {
//         console.error('Error creating product:', error);
//         res.status(500).send('Error creating product');
//       } else {
//         res.send('Product created successfully');
//       }
//     }
//   );
// });


// //create the route and function to update a specific event product information
// router.put('/eventProductImages/update/:id', upload.single('newProductImg'), (req, res) => {
//   const {
//     productName,
//     oldImg,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//   } = JSON.parse(req.body.updatedProduct);
//   const productImgFile = req.file;
//   const imgFilePath = `public/eventProductImages/${oldImg}`;
//   fs.unlink(imgFilePath, (err) => {
//     if (err) {
//       console.error('Error deleting image file:', err);
//     }
//   });
//   const productImg = productImgFile ? productImgFile.filename : null;
//   const product = {
//     productName,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//     productImg,
//   };

//   let sql = `UPDATE eventproducts SET productName='${productName}', productPrice='${productPrice}', productDescription='${productDescription}', modelNumber='${modelNumber}', printerColor='${printerColor}', connectorType='${connectorType}', stockQuantity='${stockQuantity}', shelfStartTime='${shelfStartTime}', shelfEndTime='${shelfEndTime}', afterSalesText='${afterSalesText}', afterSalesInstruction='${afterSalesInstruction}', inventoryText='${inventoryText}', productImg='${productImg}' WHERE id=?`;

//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     res.json(result);
//   });
// });


// router.put('/eventProductImages/update/textInformation/:id', (req, res) => {
//   const {
//     productName,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//     link,
//     mark,
//     slideImageMark
//   } = req.body.updatedProduct;

//   const product = {
//     productName,
//     productPrice,
//     productDescription,
//     modelNumber,
//     printerColor,
//     connectorType,
//     stockQuantity,
//     shelfStartTime,
//     shelfEndTime,
//     afterSalesText,
//     afterSalesInstruction,
//     inventoryText,
//     link,
//     mark,
//     slideImageMark
//   };

//   let sql = `UPDATE eventproducts SET productName=?, productPrice=?, productDescription=?, modelNumber=?, printerColor=?, connectorType=?, stockQuantity=?, shelfStartTime=?, shelfEndTime=?, afterSalesText=?, afterSalesInstruction=?, inventoryText=?,link=?,mark=?,slideImageMark=? WHERE id=?`;

//   connection.query(sql, [productName, productPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, link, mark, slideImageMark, req.params.id], function (err, result) {
//     if (err) {
//       console.error('Error updating database:', err);
//       res.status(500).send('Error updating database');
//       return;
//     }
//     res.json(result);
//   });
// });


// router.put('/eventProductImages/updateRelatedImages/:id', upload.array('images', 10), (req, res) => {
//   const productId = req.params.id;
//   const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;

//   connection.query(sqlSelect, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving event product:', err);
//       res.status(500).send('Error retrieving event product');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('event product not found');
//       return;
//     }
//     const product = rows[0];
//     const imageFilesBefore = product.allDescriptionImages ? product.allDescriptionImages.split(",") : [];

//     imageFilesBefore.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting image file:', err);
//         }
//       });
//     });

//     // Handle the uploaded files in req.files
//     const updatedImages = req.files.map(file => file.filename);

//     // Compare filenames before and after unlinking
//     const removedImages = imageFilesBefore.filter(filename => !updatedImages.includes(filename));

//     // Your logic to update the related images in the database goes here
//     if (removedImages.length > 0) {
//       const sqlUpdate = `UPDATE eventproducts SET allImages = ? WHERE id = ?`;
//       const newImageFiles = updatedImages.join(",");
//       connection.query(sqlUpdate, [newImageFiles, productId], function (updateErr, updateResult) {
//         if (updateErr) {
//           console.error('Error updating database with new image filenames:', updateErr);
//           res.status(500).send('Error updating database with new image filenames');
//           return;
//         }
//         res.status(200).json({ message: 'Related images updated successfully' });
//       });
//     } else {
//       res.status(200).json({ message: 'Related images updated successfully' });
//     }
//   });
// });


// router.put('/eventProductImages/updateDescriptionImage/:id', upload.array('images', 10), (req, res) => {
//   const productId = req.params.id;
//   const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;
//   connection.query(sqlSelect, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving event product:', err);
//       res.status(500).send('Error retrieving event product');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('event product not found');
//       return;
//     }
//     const product = rows[0];
//     const imageFilesBefore = product.allImages ? product.allImages.split(",") : [];
//     // Delete old images
//     imageFilesBefore.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting image file:', err);
//         }
//       });
//     });

//     // Handle the uploaded files in req.files
//     const updatedImages = req.files.map(file => file.filename);

//     // Compare filenames before and after unlinking
//     const removedImages = imageFilesBefore.filter(filename => !updatedImages.includes(filename));

//     // Your logic to update the related images in the database goes here
//     if (removedImages.length > 0) {
//       const sqlUpdate = `UPDATE eventproducts SET allDescriptionImages = ? WHERE id = ?`;
//       const newImageFiles = updatedImages.join(",");
//       connection.query(sqlUpdate, [newImageFiles, productId], function (updateErr, updateResult) {
//         if (updateErr) {
//           console.error('Error updating database with new image filenames:', updateErr);
//           res.status(500).send('Error updating database with new image filenames');
//           return;
//         }
//         res.status(200).json({ message: 'description images updated successfully' });
//       });
//     } else {
//       res.status(200).json({ message: 'description images updated successfully' });
//     }
//   });
// });


// //This part to make the api to update the Instruction Images
// router.put('/eventProductImages/updateInstructionsImages/:id', upload.array('images', 10), (req, res) => {
//   const productId = req.params.id;
//   const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;
//   connection.query(sqlSelect, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving event product:', err);
//       return res.status(500).send('Error retrieving event product');
//     }
//     if (rows.length === 0) {
//       return res.status(404).send('Event product not found');
//     }
//     const product = rows[0];
//     const imageFilesBefore = product.allInstructionsImage ? product.allInstructionsImage.split(",") : [];

//     // Handle the uploaded files in req.files
//     const updatedImages = req.files.map(file => file.filename);

//     // Delete old images if there are any
//     if (imageFilesBefore.length > 0) {
//       imageFilesBefore.forEach((filename) => {
//         const filePath = `public/eventProductImages/${filename}`;
//         fs.unlink(filePath, (err) => {
//           if (err) {
//             console.error('Error deleting image file:', err);
//           }
//         });
//       });
//     }

//     // Compare filenames before and after unlinking
//     const removedImages = imageFilesBefore.filter(filename => !updatedImages.includes(filename));

//     // Your logic to update the related images in the database goes here
//     const sqlUpdate = `UPDATE eventproducts SET allInstructionsImage = ? WHERE id = ?`;
//     const newImageFiles = updatedImages.join(",");

//     connection.query(sqlUpdate, [newImageFiles, productId], function (updateErr, updateResult) {
//       if (updateErr) {
//         console.error('Error updating database with new image filenames:', updateErr);
//         return res.status(500).send('Error updating database with new image filenames');
//       }
//       return res.status(200).json({ message: 'InstructionsImage images updated successfully' });
//     });
//   });
// });


// //This part to make the api to update the Related Videos
// router.put('/eventProductImages/updateRelatedVideos/:id', upload.array('videos', 10), (req, res) => {
//   const productId = req.params.id;
//   const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;
//   connection.query(sqlSelect, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving mall product:', err);
//       res.status(500).send('Error retrieving mall product');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('Event product not found');
//       return;
//     }
//     const product = rows[0];
//     const videoFilesBefore = product.allVideos ? product.allVideos.split(",") : [];

//     // Handle the uploaded files in req.files
//     const updatedVideos = req.files.map(file => file.filename);

//     // Compare filenames before and after uploading
//     const removedVideos = videoFilesBefore.filter(filename => !updatedVideos.includes(filename));

//     // Delete only those old videos that are not present in the updated list
//     removedVideos.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting video file:', err);
//         }
//       });
//     });

//     if (removedVideos.length > 0 || updatedVideos.length > 0) {
//       const sqlUpdate = `UPDATE eventproducts SET allVideos = ? WHERE id = ?`;
//       const newVideoFiles = updatedVideos.join(",");

//       connection.query(sqlUpdate, [newVideoFiles, productId], function (updateErr, updateResult) {
//         if (updateErr) {
//           console.error('Error updating database with new video filenames:', updateErr);
//           res.status(500).send('Error updating database with new video filenames');
//           return;
//         }
//         res.status(200).json({ message: 'allRelative Videos updated successfully' });
//       });
//     } else {
//       res.status(200).json({ message: 'allRelative  Videos updated successfully' });
//     }
//   });
// });


// //This part to make the api to update the Instruction Videos
// router.put('/eventProductImages/updateInstructionVideos/:id', upload.array('videos', 10), (req, res) => {
//   const productId = req.params.id;
//   const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;
//   connection.query(sqlSelect, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving mall product:', err);
//       res.status(500).send('Error retrieving mall product');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('Mall product not found');
//       return;
//     }
//     const product = rows[0];
//     const videoFilesBefore = product.allInstructionsVideos ? product.allInstructionsVideos.split(",") : [];

//     // Handle the uploaded files in req.files
//     const updatedVideos = req.files.map(file => file.filename);

//     // Compare filenames before and after uploading
//     const removedVideos = videoFilesBefore.filter(filename => !updatedVideos.includes(filename));

//     // Delete only those old videos that are not present in the updated list
//     removedVideos.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting video file:', err);
//         }
//       });
//     });

//     // Your logic to update the related videos in the database goes here
//     if (removedVideos.length > 0 || updatedVideos.length > 0) {
//       const sqlUpdate = `UPDATE eventproducts SET allInstructionsVideos = ? WHERE id = ?`;
//       const newVideoFiles = updatedVideos.join(",");

//       connection.query(sqlUpdate, [newVideoFiles, productId], function (updateErr, updateResult) {
//         if (updateErr) {
//           console.error('Error updating database with new video filenames:', updateErr);
//           res.status(500).send('Error updating database with new video filenames');
//           return;
//         }
//         res.status(200).json({ message: 'InstructionsVideos updated successfully' });
//       });
//     } else {
//       res.status(200).json({ message: 'InstructionsVideos updated successfully' });
//     }
//   });
// });


// //create the route and function to delete event product according to the id
// router.delete('/eventProducts/delete/:id', (req, res) => {
//   const productId = req.params.id;
//   const sql = `SELECT * FROM eventproducts WHERE id = ?`;
//   connection.query(sql, [productId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving event product:', err);
//       res.status(500).send('Error retrieving event product');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('Event products not found');
//       return;
//     }
//     const product = rows[0];
//     const imgFilePath = `public/eventProductImages/${product.productImg}`;
//     fs.unlink(imgFilePath, (err) => {
//       if (err) {
//         console.error('Error deleting image file:', err);
//       }
//     });

//     // Delete associated images
//     const imageFiles = product.allImages ? product.allImages.split(",") : [];
//     imageFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting image file:', err);
//         }
//       });
//     });
//     // Delete associated images
//     const descriptionImageFiles = product.allDescriptionImages ? product.allDescriptionImages.split(",") : [];
//     descriptionImageFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting image file:', err);
//         }
//       });
//     });

//     // Delete associated images
//     const instructionsImageFiles = product.instructionsImages ? product.instructionsImages.split(",") : [];
//     instructionsImageFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting image file:', err);
//         }
//       });
//     });

//     // Delete associated videos
//     const videoFiles = product.allVideos ? (product.allVideos).split(",") : [];
//     videoFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting video file:', err);
//         }
//       });
//     });

//     const instructionsVideoFiles = product.instructionsVideos ? (product.instructionsVideos).split(",") : [];
//     instructionsVideoFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting video file:', err);
//         }
//       });
//     });

//     // Delete associated files
//     const invoiceFiles = product.invoiceFile ? (product.invoiceFile).split(",") : [];

//     invoiceFiles.forEach((filename) => {
//       const filePath = `public/eventProductImages/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error('Error deleting video file:', err);
//         }
//       });
//     });

//     const deleteSql = `DELETE FROM eventproducts WHERE id = ?`;
//     connection.query(deleteSql, [productId], function (err, result) {
//       if (err) {
//         console.error('Error deleting Event Product from database:', err);
//         res.status(500).send('Error deleting Event Product from database');
//         return;
//       }
//       res.json(result);
//     });
//   });
// });


// module.exports = router;







const express = require("express");
const connection = require("../config/db");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const router = express.Router();
// const upload = require('./uploadConfig');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// Set the specific folder to serve static files
router.use(express.static("public"));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/eventProductImages");
  },
  filename: (req, file, cb) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    cb(null, `${file.fieldname}_${Date.now()}${randomDigits}${path.extname(file.originalname)}`);
  },
});

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Utility function to handle query execution
const executeQuery = async (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

// Get all event products
router.get("/eventProducts", async (req, res) => {
  try {
    const results = await executeQuery("SELECT * FROM eventproducts", []);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Error retrieving products");
  }
});

// Get event products by slideImageMark
router.get("/eventProducts/slideImageSearch", async (req, res) => {
  try {
    const { slideImageMark } = req.body;
    const results = await executeQuery(
      "SELECT * FROM eventproducts WHERE slideImageMark = ?",
      [slideImageMark]
    );
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Error retrieving products");
  }
});

// Get event product by productName
router.get("/eventProducts/:productName", async (req, res) => {
  try {
    const { productName } = req.params;
    const results = await executeQuery(
      "SELECT * FROM eventproducts WHERE productName = ?",
      [productName]
    );
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("Error retrieving product");
  }
});

// Get event products by region
router.get("/eventProducts/region/:productName/:productCountryName", async (req, res) => {
  try {
    const { productName, productCountryName } = req.params;
    const results = await executeQuery(
      "SELECT * FROM eventproducts WHERE productName = ? AND productCountryName = ?",
      [productName, productCountryName]
    );
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving products by region:", error);
    res.status(500).send("Error retrieving products by region");
  }
});

// Get event products by country
router.get("/eventProducts/country/:productCountryName", async (req, res) => {
  try {
    const { productCountryName } = req.params;
    const results = await executeQuery(
      "SELECT * FROM eventproducts WHERE productCountryName = ?",
      [productCountryName]
    );
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving products by country:", error);
    res.status(500).send("Error retrieving products by country");
  }
});

// Add event product
router.post(
  "/eventProducts/add",
  upload.fields([
    { name: "productImg" },
    { name: "invoiceFiles" },
    { name: "images" },
    { name: "descriptionImages" },
    { name: "videos" },
    { name: "instructionsImages" },
    { name: "instructionsVideos" },
  ]),
  async (req, res) => {
    try {
      const {
        productCountryName,
        productName,
        productPrice,
        productOriginalPrice,
        productDescription,
        modelNumber,
        printerColor,
        connectorType,
        stockQuantity,
        productImgLink,
        productImgRemark,
        relatedImgLink,
        relatedImgRemark,
        descriptionImgRemark,
        shelfStartTime,
        shelfEndTime,
        afterSalesText,
        afterSalesInstruction,
        inventoryText,
        date,
        time,
        link,
        mark,
        slideImageMark,
      } = req.body;

      const productImgFile = req.files["productImg"];
      const imgPath = "https://grozziieget.zjweiting.com:8033/tht/eventProductImages";

      const product = {
        productCountryName,
        productName,
        productPrice,
        productOriginalPrice,
        productDescription,
        modelNumber,
        printerColor,
        connectorType,
        stockQuantity,
        imgPath,
        productImgLink,
        productImgRemark,
        relatedImgLink,
        relatedImgRemark,
        descriptionImgRemark,
        shelfStartTime,
        shelfEndTime,
        afterSalesText,
        afterSalesInstruction,
        inventoryText,
        productImg: productImgFile ? productImgFile[0].filename : null,
        date,
        time,
        link,
        mark,
        slideImageMark,
      };

      const optionalFields = [
        "images",
        "descriptionImages",
        "videos",
        "instructionsImages",
        "instructionsVideos",
        "invoiceFiles",
      ];

      optionalFields.forEach((field) => {
        if (req.files[field] && req.files[field].length > 0) {
          product[field] = req.files[field].map((file) => file.filename).join(",");
        }
      });

      const query =
        "INSERT INTO eventproducts (productCountryName, productName, productPrice, productOriginalPrice, productDescription, modelNumber, printerColor, connectorType, stockQuantity, imgPath, productImgLink, productImgRemark, relatedImgLink, relatedImgRemark, descriptionImgRemark, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg, invoiceFile, allImages, allDescriptionImages, allVideos, allInstructionsImage, allInstructionsVideos, date, time, link, mark, slideImageMark) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      await executeQuery(query, [
        product.productCountryName,
        product.productName,
        product.productPrice,
        product.productOriginalPrice,
        product.productDescription,
        product.modelNumber,
        product.printerColor,
        product.connectorType,
        product.stockQuantity,
        product.imgPath,
        product.productImgLink,
        product.productImgRemark,
        product.relatedImgLink,
        product.relatedImgRemark,
        product.descriptionImgRemark,
        product.shelfStartTime,
        product.shelfEndTime,
        product.afterSalesText,
        product.afterSalesInstruction,
        product.inventoryText,
        product.productImg,
        product.invoiceFiles || null,
        product.images || null,
        product.descriptionImages || null,
        product.videos || null,
        product.instructionsImages || null,
        product.instructionsVideos || null,
        product.date,
        product.time,
        product.link,
        product.mark,
        product.slideImageMark,
      ]);

      res.send("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send("Error creating product");
    }
  }
);


// Helper function to delete files
const deleteFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
    });
  });
};

// Helper function for database updates
const updateDatabase = (sql, values, res, successMessage) => {
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating database:', err);
      return res.status(500).send('Error updating database');
    }
    res.status(200).json({ message: successMessage, result });
  });
};

// Update main product information
router.put('/eventProductImages/update/:id', upload.single('newProductImg'), (req, res) => {
  const {
    productName,
    oldImg,
    productPrice,
    productOriginalPrice,
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
  } = JSON.parse(req.body.updatedProduct);

  const productImgFile = req.file;
  const productImg = productImgFile ? productImgFile.filename : null;

  if (oldImg) {
    deleteFiles([`public/eventProductImages/${oldImg}`]);
  }

  const sql = `
    UPDATE eventproducts 
    SET productName=?, productPrice=?, productOriginalPrice=?, productDescription=?, modelNumber=?, printerColor=?, connectorType=?,
        stockQuantity=?, shelfStartTime=?, shelfEndTime=?, afterSalesText=?, afterSalesInstruction=?, 
        inventoryText=?, productImg=? 
    WHERE id=?`;

  updateDatabase(sql, [productName, productPrice, productOriginalPrice, productDescription, modelNumber, printerColor, connectorType,
    stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, productImg, req.params.id], res, 'Product updated successfully');
});

// Update text information
router.put('/eventProductImages/update/textInformation/:id', (req, res) => {
  const {
    productName,
    productPrice,
    productOriginalPrice,
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
    link,
    mark,
    slideImageMark
  } = req.body.updatedProduct;

  const sql = `
    UPDATE eventproducts 
    SET productName=?, productPrice=?, productOriginalPrice=? productDescription=?, modelNumber=?, printerColor=?, connectorType=?,
        stockQuantity=?, shelfStartTime=?, shelfEndTime=?, afterSalesText=?, afterSalesInstruction=?, 
        inventoryText=?, link=?, mark=?, slideImageMark=? 
    WHERE id=?`;

  updateDatabase(sql, [productName, productPrice, productOriginalPrice, productDescription, modelNumber, printerColor, connectorType,
    stockQuantity, shelfStartTime, shelfEndTime, afterSalesText, afterSalesInstruction, inventoryText, link, mark, slideImageMark, req.params.id], res, 'Text information updated successfully');
});

// Generalized image update handler
const updateImages = (tableColumn, req, res) => {
  const productId = req.params.id;
  const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;

  connection.query(sqlSelect, [productId], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(err ? 500 : 404).send(err ? 'Error retrieving product' : 'Product not found');
    }

    const product = rows[0];
    const existingFiles = product[tableColumn] ? product[tableColumn].split(",") : [];
    deleteFiles(existingFiles.map(file => `public/eventProductImages/${file}`));

    const updatedFiles = req.files.map(file => file.filename);
    const sqlUpdate = `UPDATE eventproducts SET ${tableColumn} = ? WHERE id = ?`;

    updateDatabase(sqlUpdate, [updatedFiles.join(","), productId], res, `${tableColumn} updated successfully`);
  });
};
// Wrapper to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// Update related images
router.put(
  '/eventProductImages/updateRelatedImages/:id',
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    await updateImages('allImages', req, res);
  })
);

// Update description images
router.put(
  '/eventProductImages/updateDescriptionImage/:id',
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    await updateImages('allDescriptionImages', req, res);
  })
);

// Update instruction images
router.put(
  '/eventProductImages/updateInstructionsImages/:id',
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    await updateImages('allInstructionsImage', req, res);
  })
);

// Update related videos
router.put(
  '/eventProductImages/updateRelatedVideos/:id',
  upload.array('videos', 10),
  asyncHandler(async (req, res) => {
    await updateImages('allVideos', req, res);
  })
);



// Update instruction videos
router.put('/eventProductImages/updateInstructionVideos/:id', upload.array('videos', 10), (req, res) => {
  const productId = req.params.id;
  const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;
  connection.query(sqlSelect, [productId], (err, rows) => {
    if (err) {
      console.error('Error retrieving product:', err);
      return res.status(500).send('Error retrieving product');
    }
    if (rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = rows[0];
    const existingVideos = product.allInstructionsVideos ? product.allInstructionsVideos.split(",") : [];
    const uploadedVideos = req.files.map((file) => file.filename);

    const removedVideos = existingVideos.filter((video) => !uploadedVideos.includes(video));
    const newVideoList = uploadedVideos.join(",");

    // Delete removed videos
    deleteFiles(removedVideos.map((video) => path.join('public/eventProductImages', video)));

    // Update database
    const sqlUpdate = `UPDATE eventproducts SET allInstructionsVideos = ? WHERE id = ?`;
    connection.query(sqlUpdate, [newVideoList, productId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating videos in database:', updateErr);
        return res.status(500).send('Error updating videos');
      }
      res.status(200).json({ message: 'Instruction videos updated successfully' });
    });
  });
});

// Delete event product
router.delete('/eventProducts/delete/:id', (req, res) => {
  const productId = req.params.id;
  const sqlSelect = `SELECT * FROM eventproducts WHERE id = ?`;

  connection.query(sqlSelect, [productId], (err, rows) => {
    if (err) {
      console.error('Error retrieving product:', err);
      return res.status(500).send('Error retrieving product');
    }
    if (rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = rows[0];
    const filesToDelete = [
      path.join('public/eventProductImages', product.productImg),
      ...(product.allImages || '').split(",").map((img) => path.join('public/eventProductImages', img)),
      ...(product.allDescriptionImages || '').split(",").map((img) => path.join('public/eventProductImages', img)),
      ...(product.instructionsImages || '').split(",").map((img) => path.join('public/eventProductImages', img)),
      ...(product.allVideos || '').split(",").map((vid) => path.join('public/eventProductImages', vid)),
      ...(product.instructionsVideos || '').split(",").map((vid) => path.join('public/eventProductImages', vid)),
      ...(product.invoiceFile || '').split(",").map((file) => path.join('public/eventProductImages', file)),
    ];

    // Delete files
    deleteFiles(filesToDelete);

    // Delete product from database
    const sqlDelete = `DELETE FROM eventproducts WHERE id = ?`;
    connection.query(sqlDelete, [productId], (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting product from database:', deleteErr);
        return res.status(500).send('Error deleting product');
      }
      res.json({ message: 'Product deleted successfully', result });
    });
  });
});


module.exports = router;

