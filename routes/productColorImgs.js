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
// const path = require("path");
// const { route } = require("./users");

// // Set the specific folder to show the file
// router.use(express.static('public'))

// //create the structure to upload the file with specific name
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/colorImages')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//   }
// })

// //declare the multer
// const upload = multer({
//   storage: storage
// })


// router.post('/colorImg/add', upload.single('colorImage'), (req, res) => {

//   const {
//     productId,
//     modelNumber,
//     colorName,
//     modelImage,
//     typeName,
//     productPrice,
//     stockQuantity,
//     productDescription
//   } = req.body;

//   // Check if there is an uploaded file
//   if (!req.file) {
//     return res.status(400).json({ status: 'error', message: 'No color image uploaded' });
//   }

//   // Extract the uploaded file
//   const colorImage = req.file; // Removed [0]

//   // Construct the data to be inserted into the database
//   const colorImageData = {
//     productId,
//     modelNumber,
//     colorName,
//     modelImage,
//     typeName,
//     productPrice,
//     stockQuantity,
//     productDescription,
//     colorImage: colorImage ? colorImage.filename : null // Use the filename of the uploaded image
//   };

//   // Insert the data into the database
//   connection.query(
//     'INSERT INTO allcolorimages (productId,modelNumber,colorName,modelImage,typeName,colorProductPrice,colorProductQuantity,colorProductDescription,colorImage,imgPath) VALUES (?,?,?,?,?,?, ?, ?,?, ?)',
//     [
//       productId,
//       modelNumber,
//       colorName,
//       modelImage,
//       typeName,
//       productPrice,
//       stockQuantity,
//       productDescription,
//       colorImage.filename,
//       'https://grozziieget.zjweiting.com:8033/tht/colorImages'
//     ],
//     (error, results) => {
//       if (error) {
//         console.error('Error creating color image:', error);
//         res.status(500).json({ status: 'error', message: 'Error creating color image' });
//       } else {
//         console.log('Color image created successfully');
//         res.status(200).json({ status: 'success', message: 'Color image created successfully' });
//       }
//     }
//   );
// });


// router.put('/colorImg/edit/:id', (req, res) => {
//   const colorId = req.params.id;
//   const {
//     colorName,
//     typeName,
//     colorProductPrice,
//     colorProductQuantity,
//     colorProductDescription
//   } = req.body;

//   // Check if there are any changes in the request body
//   if (!colorName && !typeName && !colorProductPrice && !colorProductQuantity && !colorProductDescription) {
//     return res.status(400).json({ status: 'error', message: 'No data provided for update' });
//   }

//   // Construct the data to be updated in the database
//   const updatedColorData = {
//     colorName,
//     typeName,
//     colorProductPrice,
//     colorProductQuantity,
//     colorProductDescription
//   };

//   // Update the data in the database
//   connection.query(
//     'UPDATE allcolorimages SET ? WHERE id = ?',
//     [updatedColorData, colorId],
//     (error, results) => {
//       if (error) {
//         console.error('Error updating color image:', error);
//         res.status(500).json({ status: 'error', message: 'Error updating color image' });
//       } else {
//         console.log('Color image updated successfully');
//         res.status(200).json({ status: 'success', message: 'Color image updated successfully' });
//       }
//     }
//   );
// });


// router.get('/colorImg/:modelNumber', (req, res) => {
//   const { modelNumber } = req.params;

//   const sql = 'SELECT * FROM allcolorimages WHERE modelNumber = ?';
//   connection.query(sql, [modelNumber], (error, results) => {
//     if (error) {
//       console.error('Error retrieving color images:', error.message);
//       return res.status(500).json({ status: 'error', message: 'An error occurred while retrieving color images.' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ status: 'not_found', message: `No color images found for model number: ${modelNumber}` });
//     }
//     res.status(200).json({ status: 'success', data: results });
//   });
// });


// router.get('/colorImg/productColor/:productId/:imageCategory', (req, res) => {
//   const { productId, imageCategory } = req.params;

//   const sql = 'SELECT * FROM allcolorimages WHERE productId = ? AND modelImage = ?';
//   connection.query(sql, [productId, imageCategory], (error, results) => {
//     if (error) {
//       console.error('Error retrieving color images:', error.message);
//       return res.json({
//         status: 'error',
//         message: 'An error occurred while retrieving color images.',
//       });
//     }
//     if (results.length === 0) {
//       return res.json({
//         status: 'not_found',
//         message: 'No color images found for the given product and image category.',
//       });
//     }
//     res.status(200).json({
//       status: 'success',
//       data: results,
//     });
//   });
// });


// router.delete('/colorImgs/delete/:id', (req, res) => {
//   const colorId = req.params.id;
//   const sql = `SELECT * FROM allcolorimages WHERE productId = ?`;
//   connection.query(sql, [colorId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving colorImg:', err);
//       res.status(500).send('Error retrieving colorImg');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('colorImg not found');
//       return;
//     }
//     const icon = rows[0];

//     //start from here to unlink and delete the file from the folder
//     const filePath = `public/colorImages/${icon.colorImage}`;
//     fs.unlink(filePath, function (err) {
//       if (err) {
//         console.error('Error deleting file:', err);
//         res.status(500).send('Error deleting file');
//         return;
//       }
//       const deleteSql = `DELETE FROM allcolorimages WHERE productId = ?`;
//       connection.query(deleteSql, [colorId], function (err, result) {
//         if (err) {
//           console.error('Error deleting icon from database:', err);
//           res.status(500).send('Error deleting icon from database');
//           return;
//         }
//         res.json(result);
//       });
//     });
//   });
// });


// router.delete('/colorInfo/delete/:id', (req, res) => {
//   const colorId = req.params.id;
//   const sql = `SELECT * FROM allcolorimages WHERE id = ?`;
//   connection.query(sql, [colorId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving colorImg:', err);
//       res.status(500).send('Error retrieving colorImg');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('colorImg not found');
//       return;
//     }

//     const icon = rows[0];
//     //start from here to unlink and delete the file from the folder
//     const filePath = `public/colorImages/${icon.colorImage}`;
//     fs.unlink(filePath, function (err) {
//       if (err) {
//         console.error('Error deleting file:', err);
//         res.status(500).send('Error deleting file');
//         return;
//       }

//       const deleteSql = `DELETE FROM allcolorimages WHERE id = ?`;
//       connection.query(deleteSql, [colorId], function (err, result) {
//         if (err) {
//           console.error('Error deleting icon from database:', err);
//           res.status(500).send('Error deleting icon from database');
//           return;
//         }
//         res.json(result);
//       });
//     });
//   });
// });


// module.exports = router;



const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
const multer = require("multer");
const path = require("path");

// Set up static folder to serve the file
router.use(express.static("public"));

// Storage setup for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/colorImages");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

// Multer setup for file upload
const upload = multer({
  storage: storage
});

// POST route to add a color image
router.post("/colorImg/add", upload.single("colorImage"), async (req, res) => {
  try {
    const {
      productId,
      modelNumber,
      colorName,
      modelImage,
      typeName,
      productPrice,
      stockQuantity,
      productDescription
    } = req.body;

    // Check if there is an uploaded file
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No color image uploaded" });
    }

    // Extract uploaded file
    const colorImage = req.file;

    // Insert the data into the database
    const sql = `
      INSERT INTO allcolorimages (productId, modelNumber, colorName, modelImage, typeName, colorProductPrice, colorProductQuantity, colorProductDescription, colorImage, imgPath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      productId,
      modelNumber,
      colorName,
      modelImage,
      typeName,
      productPrice,
      stockQuantity,
      productDescription,
      colorImage.filename,
      "https://grozziieget.zjweiting.com:8033/tht/colorImages"
    ];

    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error("Error creating color image:", error);
        return res.status(500).json({ status: "error", message: "Error creating color image" });
      }
      console.log("Color image created successfully");
      return res.status(200).json({ status: "success", message: "Color image created successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

// PUT route to edit a color image
router.put("/colorImg/edit/:id", async (req, res) => {
  try {
    const colorId = req.params.id;
    const { colorName, typeName, colorProductPrice, colorProductQuantity, colorProductDescription } = req.body;

    // Validate input
    if (!colorName && !typeName && !colorProductPrice && !colorProductQuantity && !colorProductDescription) {
      return res.status(400).json({ status: "error", message: "No data provided for update" });
    }

    const updatedColorData = { colorName, typeName, colorProductPrice, colorProductQuantity, colorProductDescription };

    connection.query("UPDATE allcolorimages SET ? WHERE id = ?", [updatedColorData, colorId], (error, results) => {
      if (error) {
        console.error("Error updating color image:", error);
        return res.status(500).json({ status: "error", message: "Error updating color image" });
      }
      console.log("Color image updated successfully");
      return res.status(200).json({ status: "success", message: "Color image updated successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

// GET route to retrieve color images by model number
router.get("/colorImg/:modelNumber", async (req, res) => {
  try {
    const { modelNumber } = req.params;
    const sql = "SELECT * FROM allcolorimages WHERE modelNumber = ?";
    connection.query(sql, [modelNumber], (error, results) => {
      if (error) {
        console.error("Error retrieving color images:", error);
        return res.status(500).json({ status: "error", message: "An error occurred while retrieving color images." });
      }
      if (results.length === 0) {
        return res.status(404).json({ status: "not_found", message: `No color images found for model number: ${modelNumber}` });
      }
      return res.status(200).json({ status: "success", data: results });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

// GET route to retrieve color images by productId and imageCategory
router.get("/colorImg/productColor/:productId/:imageCategory", async (req, res) => {
  try {
    const { productId, imageCategory } = req.params;
    const sql = "SELECT * FROM allcolorimages WHERE productId = ? AND modelImage = ?";
    connection.query(sql, [productId, imageCategory], (error, results) => {
      if (error) {
        console.error("Error retrieving color images:", error);
        return res.status(500).json({ status: "error", message: "An error occurred while retrieving color images." });
      }
      if (results.length === 0) {
        return res.status(404).json({ status: "not_found", message: "No color images found for the given product and image category." });
      }
      return res.status(200).json({ status: "success", data: results });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

// DELETE route to delete a color image by ID
router.delete("/colorImgs/delete/:id", async (req, res) => {
  try {
    const colorId = req.params.id;
    const sql = "SELECT * FROM allcolorimages WHERE id = ?";
    connection.query(sql, [colorId], (error, rows) => {
      if (error) {
        console.error("Error retrieving colorImg:", error);
        return res.status(500).send("Error retrieving colorImg");
      }
      if (rows.length === 0) {
        return res.status(404).send("colorImg not found");
      }
      const icon = rows[0];

      // Unlink and delete the file from the folder
      const filePath = `public/colorImages/${icon.colorImage}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).send("Error deleting file");
        }

        const deleteSql = "DELETE FROM allcolorimages WHERE id = ?";
        connection.query(deleteSql, [colorId], (err, result) => {
          if (err) {
            console.error("Error deleting icon from database:", err);
            return res.status(500).send("Error deleting icon from database");
          }
          return res.json(result);
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

// DELETE route to delete color info by ID
router.delete("/colorInfo/delete/:id", async (req, res) => {
  try {
    const colorId = req.params.id;
    const sql = "SELECT * FROM allcolorimages WHERE id = ?";
    connection.query(sql, [colorId], (error, rows) => {
      if (error) {
        console.error("Error retrieving colorImg:", error);
        return res.status(500).send("Error retrieving colorImg");
      }
      if (rows.length === 0) {
        return res.status(404).send("colorImg not found");
      }

      const icon = rows[0];
      const filePath = `public/colorImages/${icon.colorImage}`;

      // Unlink and delete the file from the folder
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).send("Error deleting file");
        }

        const deleteSql = "DELETE FROM allcolorimages WHERE id = ?";
        connection.query(deleteSql, [colorId], (err, result) => {
          if (err) {
            console.error("Error deleting icon from database:", err);
            return res.status(500).send("Error deleting icon from database");
          }
          return res.json(result);
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: "An unexpected error occurred" });
  }
});

module.exports = router;
