// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');
// const Blob = require('blob');

// //Require multer for upload different files
// const multer = require("multer")

// //Require path to view file file according to the path
// const path = require("path")

// //Require fs to unlink the file at the time to update and delete
// const fs = require('fs');
// const { base64StringToBlob } = require("blob-util");

// const app = express();
// app.use(cors());

// //create the route and function to add Category name 
// router.post('/labelCategories/add', (req, res) => {
//   const categoryName = req.body.categoryName;
//   const subCategoryName = req.body.subCategoryName || [];
//   let sql = `INSERT INTO alllevelcategories (allCategories, subCategories) VALUES (?, ?)`;
//   connection.query(sql, [categoryName, JSON.stringify(subCategoryName)], function (err, result) {
//     if (err) {
//       console.error("Error inserting category name and subcategories:", err);
//       res.status(500).json({ error: "An error occurred while inserting category name and subcategories." });
//     } else {
//       console.log("Successfully inserted category name and subcategories", result);
//       res.json(result);
//     }
//   });
// });


// //create the route and function to update the subCategory Name under the  Category name 
// router.put('/labelCategories/update/:id', (req, res) => {
//   const categoryId = req.params.id; // Extract the category ID from the request parameters
//   const updatedCategoryName = req.body.updatedCategoryName; // Extract the updated category name from the request body
//   let sql = `UPDATE alllevelcategories SET allCategories = ? WHERE id = ?`;
//   connection.query(sql, [updatedCategoryName, categoryId], function (err, result) {
//     if (err) {
//       console.error("Error updating category name:", err);
//       res.status(500).json({ error: "An error occurred while updating category name." });
//     } else {
//       console.log("Successfully updated category name", result);
//       res.json(result);
//     }
//   });
// });


// //create the route and function to Edit the subCategory Name under the  Category name 
// router.put('/labelSubCategories/update/:categoryName', (req, res) => {
//   const categoryName = req.params.categoryName;
//   const subCategoryName = req.body.subCategoryName || [];
//   let sql = `UPDATE alllevelcategories SET subCategories = ? WHERE allCategories = ?`;
//   connection.query(sql, [JSON.stringify(subCategoryName), categoryName], function (err, result) {
//     if (err) {
//       console.error("Error updating subcategories based on category name:", err);
//       res.status(500).json({ error: "An error occurred while updating subcategories based on category name." });
//     } else {
//       console.log("Successfully updated subcategories based on category name", result);
//       res.json(result);
//     }
//   });
// });


// router.get('/labelCategories', (req, res) => {
//   const sql = 'SELECT * FROM alllevelcategories';
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'An error occurred while fetching label categories.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and function to add the labelList and LabelView Name under the  SubCategory name 
// router.post('/allLabelData/add', (req, res) => {
//   const { subCategoryName, labelDataList, LabelDataView } = req.body;
//   const dataToStore = {
//     subCategoryName,
//     labelDataList: labelDataList || {},
//     LabelDataView: LabelDataView || {}
//   };

//   let sql = `INSERT INTO alllabeldata (subCategoryName, labelDataList, LabelDataView) VALUES (?, ?, ?)`;
//   connection.query(sql, [dataToStore.subCategoryName, JSON.stringify(dataToStore.labelDataList), JSON.stringify(dataToStore.LabelDataView)], function (err, result) {
//     if (err) {
//       console.error("Error inserting data:", err);
//       res.status(500).json({ error: "An error occurred while inserting data." });
//     } else {
//       console.log("Successfully inserted data", result);
//       res.json(result);
//     }
//   });
// });


// //create the route and function to update the subCategory Name and all the label information
// router.put('/allLabelData/update/:id', (req, res) => {
//   const categoryId = req.params.id; // Extract the category ID from the request parameters
//   const { subCategoryName, labelDataList, LabelDataView } = req.body;
//   const dataToUpdate = {
//     subCategoryName,
//     labelDataList: labelDataList || {},
//     LabelDataView: LabelDataView || {}
//   };

//   let sql = `UPDATE alllabeldata SET subCategoryName = ?, labelDataList = ?, LabelDataView = ? WHERE id = ?`;
//   connection.query(sql, [dataToUpdate.subCategoryName, JSON.stringify(dataToUpdate.labelDataList), JSON.stringify(dataToUpdate.LabelDataView), categoryId], function (err, result) {
//     if (err) {
//       console.error("Error updating data:", err);
//       res.status(500).json({ error: "An error occurred while updating data." });
//     } else {
//       console.log("Successfully updated data", result);
//       res.json(result);
//     }
//   });
// });


// router.get('/allLabelData', (req, res) => {
//   const sql = 'SELECT * FROM alllabeldata';
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching all label data:', err.message);
//       return res.status(500).json({ error: 'An error occurred while fetching label data.' });
//     }
//     res.json(results.length > 0 ? results : []); // Return an empty array if no data is found
//   });
// });



// router.get('/allLabelData/:subCategoryName', (req, res) => {
//   const subCategoryName = req.params.subCategoryName;
//   const sql = 'SELECT * FROM alllabeldata WHERE subCategoryName = ?';
//   connection.query(sql, [subCategoryName], (err, results) => {
//     if (err) {
//       console.error('Error fetching data for subCategoryName:', subCategoryName, '-', err.message);
//       return res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
//     res.json(results.length > 0 ? results : []); // Return empty array if no results
//   });
// });


// router.delete('/allLabelData/deleteByMyId/:myid', (req, res) => {
//   const myid = req.params.myid;
//   const sql = `DELETE FROM alllabeldata WHERE JSON_UNQUOTE(JSON_EXTRACT(labelDataView, '$.myid')) = ?`;
//   connection.query(sql, [myid], function (err, result) {
//     if (err) {
//       console.error('Error deleting records:', err);
//       res.status(500).send('Error deleting records.');
//     } else {
//       console.log(`Successfully deleted records with myid ${myid}`);
//       res.json(result);
//     }
//   });
// });


// //new  code for maincontainers table and  widgetcontainertable   
// router.post('/mainContainers/add', (req, res) => {
//   const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;

//   const dataToStore = {
//     containerName,
//     containerHeight, // Default to null if not provided
//     containerWidth, // Default to null if not provided
//     containerImageBitmapData: containerImageBitmapData || null, // Default to null if not provided
//     subCategories, // Default to null if not provided
//     printerType
//   };

//   let sql = `INSERT INTO maincontainertable (containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories,printerType) VALUES (?, ?, ?, ?, ?,?)`;
//   connection.query(sql, [dataToStore.containerName, dataToStore.containerHeight, dataToStore.containerWidth, JSON.stringify(dataToStore.containerImageBitmapData), dataToStore.subCategories, dataToStore.printerType], function (err, result) {
//     if (err) {
//       console.error("Error inserting data:", err);
//       res.status(500).json({ error: "An error occurred while inserting data." });
//     } else {
//       console.log("Successfully inserted data", result);
//       res.json(result);
//     }
//   });
// });


// // Update a MainContainer by its ID
// router.put('/mainContainers/update/:id', (req, res) => {
//   const mainContainersId = req.params.id; // Extract the category ID from the request parameters
//   const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;

//   const dataToStore = {
//     containerName,
//     containerHeight,
//     containerWidth,
//     containerImageBitmapData: containerImageBitmapData || null,
//     subCategories,
//     printerType
//   };

//   let sql = `UPDATE maincontainertable SET containerName = ?, containerHeight = ?, containerWidth = ?, containerImageBitmapData = ?, subCategories = ?,printerType=? WHERE id = ?`;
//   connection.query(sql, [dataToStore.containerName, dataToStore.containerHeight, dataToStore.containerWidth, JSON.stringify(dataToStore.containerImageBitmapData), dataToStore.subCategories, dataToStore.printerType, mainContainersId], function (err, result) {
//     if (err) {
//       console.error("Error updating data:", err);
//       res.status(500).json({ error: "An error occurred while updating data." });
//     } else {
//       console.log("Successfully updated data", result);
//       res.json(result);
//     }
//   });
// });


// router.get('/mainContainers/:subCategories', (req, res) => {
//   const subCategories = req.params.subCategories;
//   const sql = `
//     SELECT 
//       id, 
//       containerName, 
//       containerHeight, 
//       containerWidth, 
//       printerType, 
//       CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData 
//     FROM maincontainertable 
//     WHERE subCategories = ?
//   `;

//   connection.query(sql, [subCategories], (err, results) => {
//     if (err) {
//       console.error('Error fetching data for subCategories:', subCategories, '-', err.message);
//       return res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
//     if (results.length === 0) {
//       console.log(`No data found for subCategories: ${subCategories}`);
//       return res.json([]);
//     }
//     res.json(results);
//   });
// });


// // Get a MainContainer by its mainContainersID
// router.get('/mainContainers/get/main/:id', (req, res) => {
//   const id = req.params.id;

//   let sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories,printerType FROM maincontainertable WHERE id = ?`;
//   connection.query(sql, [id], function (err, results) {
//     if (err) {
//       console.error("Error fetching data:", err);
//       res.json({ message: "An error occurred while fetching data.", data: id });
//     } else {
//       if (results.length > 0) {
//         res.json(results);
//       } else {
//         res.json({ message: "No data found for the given subcategory.", data: id });
//       }
//     }
//   });
// });


// router.get('/mainContainers', (req, res) => {
//   const sql = `
//     SELECT 
//       id, 
//       containerName, 
//       containerHeight, 
//       containerWidth, 
//       CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData, 
//       subCategories,
//       printerType 
//     FROM maincontainertable
//   `;
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching all main container data:", err.message);
//       return res.status(500).json({ error: "An error occurred while fetching all data." });
//     }
//     if (results.length === 0) {
//       console.log("No data found in maincontainertable.");
//       return res.json([]);
//     }
//     res.json(results);
//   });
// });



// router.delete('/mainContainers/delete/:id', (req, res) => {
//   const mainContainersId = req.params.id;

//   let sql = 'DELETE main, widget FROM maincontainertable main LEFT JOIN widgetcontainertable widget ON main.id = widget.mainContainerId WHERE main.id = ?';
//   connection.query(sql, [mainContainersId], function (err, results) {
//     if (err) {
//       return res.json({ message: "An error occurred while deleting data.", data: mainContainersId });
//     }
//     if (results.affectedRows === 0) {
//       return res.json({ message: "No data found for the provided mainContainersId.", data: mainContainersId });
//     }
//     return res.json({ message: "Data successfully deleted.", data: mainContainersId });
//   });

// });


// // Create a new WidgetContainer
// router.post('/widgetContainers/add/', (req, res) => {
//   const { mainContainerId, type, contentData, offsetDx, offsetDy, widthSize, height, selectTimeTextScanInt, isBold, isUnderline, isItalic, fontSize, alignment, rotation, prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth, isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize } = req.body;

//   const dataToStore = {
//     mainContainerId,
//     type,
//     contentData,
//     offsetDx,
//     offsetDy,
//     widthSize,
//     height: height || null,
//     selectTimeTextScanInt: selectTimeTextScanInt || null,
//     isBold: isBold || 0,
//     isUnderline: isUnderline || 0,
//     isItalic: isItalic || 0,
//     fontSize: fontSize,
//     alignment: alignment || "left",
//     rotation: rotation,
//     prefix: prefix || null,
//     suffix: suffix || null,
//     selectedEmojiIcons: selectedEmojiIcons || {},
//     isRectangale: isRectangale || 0,
//     isRoundRectangale: isRoundRectangale || 0,
//     isCircularFixed: isCircularFixed || 0,
//     isCircularNotFixed: isCircularNotFixed || 0,
//     sliderLineWidth: sliderLineWidth,
//     isDottedLine: isDottedLine || 0,
//     rowCount: rowCount || null,
//     columnCount: columnCount || null,
//     columnWidths: columnWidths || null,
//     rowHeights: rowHeights || null,
//     cellTexts: cellTexts || null,
//     tableTextAlignment: tableTextAlignment || null,
//     tableTextBold: tableTextBold || 0,
//     tableTextUnderline: tableTextUnderline || 0,
//     tableTextItalic: tableTextItalic || 0,
//     tableTextFontSize: tableTextFontSize || null,
//   };

//   let sql = `INSERT INTO widgetcontainertable (mainContainerId, type, contentData, offsetDx, offsetDy,widthSize,  height, selectTimeTextScanInt, isBold, isUnderline, isItalic, fontSize, alignment, rotation,  prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
//     isDottedLine, rowCount, columnCount,columnWidths,rowHeights,cellTexts,tableTextAlignment,tableTextBold,tableTextUnderline,tableTextItalic,tableTextFontSize) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//   connection.query(sql, [
//     dataToStore.mainContainerId,
//     dataToStore.type,
//     dataToStore.contentData,
//     dataToStore.offsetDx,
//     dataToStore.offsetDy,
//     dataToStore.widthSize,
//     dataToStore.height,
//     dataToStore.selectTimeTextScanInt,
//     dataToStore.isBold,
//     dataToStore.isUnderline,
//     dataToStore.isItalic,
//     dataToStore.fontSize,
//     dataToStore.alignment,
//     dataToStore.rotation,

//     dataToStore.prefix,
//     dataToStore.suffix,
//     JSON.stringify(dataToStore.selectedEmojiIcons),
//     dataToStore.isRectangale,
//     dataToStore.isRoundRectangale,
//     dataToStore.isCircularFixed,
//     dataToStore.isCircularNotFixed,
//     dataToStore.sliderLineWidth,
//     dataToStore.isDottedLine,
//     dataToStore.rowCount,
//     dataToStore.columnCount,
//     dataToStore.columnWidths,
//     dataToStore.rowHeights,
//     dataToStore.cellTexts,
//     dataToStore.tableTextAlignment,
//     dataToStore.tableTextBold,
//     dataToStore.tableTextUnderline,
//     dataToStore.tableTextItalic,
//     dataToStore.tableTextFontSize

//   ], function (err, result) {
//     if (err) {
//       console.error("Error inserting data:", err);
//       res.status(500).json({ error: "An error occurred while inserting data." });
//     } else {
//       console.log("Successfully inserted data", result);
//       res.json(result);
//     }
//   });
// });


// router.get('/widgetContainers/get', (req, res) => {
//   const sql = `SELECT * FROM widgetcontainertable`;
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching widget container data:", err.message);
//       return res.status(500).json({ error: "An error occurred while fetching widget container data." });
//     }
//     if (results.length === 0) {
//       console.log("No data found in widgetcontainertable.");
//       return res.json([]);
//     }
//     res.json(results);
//   });
// });


// router.get('/widgetContainers/getMain/:id', (req, res) => {
//   const mainContainerId = req.params.id;

//   const sql = `
//     SELECT id, mainContainerId, type, contentData, offsetDx, offsetDy, isBold, isUnderline, isItalic, fontSize, alignment, rotation, widthSize, height,
//            selectTimeTextScanInt, prefix, suffix, 
//            CONVERT(selectedEmojiIcons USING utf8) AS selectedEmojiIcons, 
//            isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
//            isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, 
//            tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize
//     FROM widgetcontainertable 
//     WHERE mainContainerId = ?
//   `;

//   connection.query(sql, [mainContainerId], (err, results) => {
//     if (err) {
//       console.error("Error fetching widget data:", err.message);
//       return res.status(500).json({ error: "An error occurred while fetching widget data." });
//     }
//     if (results.length === 0) {
//       console.log(`No data found for mainContainerId: ${mainContainerId}`);
//       return res.json([]);
//     }
//     res.json(results);
//   });
// });


// // end here the Sultans code ............
// router.delete('/widgetContainers/multiDelete/:mainId', (req, res) => {
//   const mainId = req.params.mainId;

//   const sql = `DELETE FROM widgetcontainertable WHERE mainContainerId = ?`;
//   connection.query(sql, [mainId], function (err, results) {
//     if (err) {
//       console.error("Error deleting data:", err);
//       return res.status(500).json({ message: "An error occurred while deleting data.", data: mainId });
//     }
//     if (results.affectedRows === 0) {
//       // Data not found for deletion
//       return res.json({ message: "Data not found to delete", data: mainId });
//     } else {
//       // Data successfully deleted
//       console.log("Successfully deleted data for mainId:", mainId);
//       return res.json({ message: "Data successfully deleted", data: mainId });
//     }
//   });
// });


// module.exports = router;






const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const multer = require("multer");
const fs = require('fs');
const { base64StringToBlob } = require("blob-util");

const app = express();
app.use(cors());

// Helper function for database queries to avoid repeated try-catch blocks
const queryDB = async (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Route to add category name
router.post('/labelCategories/add', async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    const subCategoryName = req.body.subCategoryName || [];
    const sql = `INSERT INTO alllevelcategories (allCategories, subCategories) VALUES (?, ?)`;
    const result = await queryDB(sql, [categoryName, JSON.stringify(subCategoryName)]);
    res.json(result);
  } catch (err) {
    console.error("Error inserting category name and subcategories:", err);
    res.status(500).json({ error: "An error occurred while inserting category name and subcategories." });
  }
});

// Route to update category name
router.put('/labelCategories/update/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategoryName = req.body.updatedCategoryName;
    const sql = `UPDATE alllevelcategories SET allCategories = ? WHERE id = ?`;
    const result = await queryDB(sql, [updatedCategoryName, categoryId]);
    console.log("Successfully updated category name", result);
    res.json(result);
  } catch (err) {
    console.error("Error updating category name:", err);
    res.status(500).json({ error: "An error occurred while updating category name." });
  }
});

// Route to update subcategory name
router.put('/labelSubCategories/update/:categoryName', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const subCategoryName = req.body.subCategoryName || [];
    const sql = `UPDATE alllevelcategories SET subCategories = ? WHERE allCategories = ?`;
    const result = await queryDB(sql, [JSON.stringify(subCategoryName), categoryName]);
    console.log("Successfully updated subcategories based on category name", result);
    res.json(result);
  } catch (err) {
    console.error("Error updating subcategories:", err);
    res.status(500).json({ error: "An error occurred while updating subcategories based on category name." });
  }
});

// Route to get all label categories
router.get('/labelCategories', async (req, res) => {
  try {
    const sql = 'SELECT * FROM alllevelcategories';
    const results = await queryDB(sql);
    res.json(results.length > 0 ? results : []);
  } catch (err) {
    console.error('Error fetching label categories:', err);
    res.status(500).json({ error: 'An error occurred while fetching label categories.' });
  }
});

// Route to add label data
router.post('/allLabelData/add', async (req, res) => {
  try {
    const { subCategoryName, labelDataList, LabelDataView } = req.body;
    const sql = `INSERT INTO alllabeldata (subCategoryName, labelDataList, LabelDataView) VALUES (?, ?, ?)`;
    const result = await queryDB(sql, [subCategoryName, JSON.stringify(labelDataList), JSON.stringify(LabelDataView)]);
    console.log("Successfully inserted data", result);
    res.json(result);
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "An error occurred while inserting data." });
  }
});

// Route to update label data
router.put('/allLabelData/update/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { subCategoryName, labelDataList, LabelDataView } = req.body;
    const sql = `UPDATE alllabeldata SET subCategoryName = ?, labelDataList = ?, LabelDataView = ? WHERE id = ?`;
    const result = await queryDB(sql, [subCategoryName, JSON.stringify(labelDataList), JSON.stringify(LabelDataView), categoryId]);
    console.log("Successfully updated data", result);
    res.json(result);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: "An error occurred while updating data." });
  }
});

// Route to get all label data
router.get('/allLabelData', async (req, res) => {
  try {
    const sql = 'SELECT * FROM alllabeldata';
    const results = await queryDB(sql);
    res.json(results.length > 0 ? results : []);
  } catch (err) {
    console.error('Error fetching all label data:', err);
    res.status(500).json({ error: 'An error occurred while fetching label data.' });
  }
});

// Route to get label data for a specific subcategory
router.get('/allLabelData/:subCategoryName', async (req, res) => {
  try {
    const subCategoryName = req.params.subCategoryName;
    const sql = 'SELECT * FROM alllabeldata WHERE subCategoryName = ?';
    const results = await queryDB(sql, [subCategoryName]);
    res.json(results.length > 0 ? results : []);
  } catch (err) {
    console.error('Error fetching data for subCategoryName:', subCategoryName, '-', err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

// Route to delete label data by myid
router.delete('/allLabelData/deleteByMyId/:myid', async (req, res) => {
  try {
    const myid = req.params.myid;
    const sql = `DELETE FROM alllabeldata WHERE JSON_UNQUOTE(JSON_EXTRACT(labelDataView, '$.myid')) = ?`;
    const result = await queryDB(sql, [myid]);
    console.log(`Successfully deleted records with myid ${myid}`);
    res.json(result);
  } catch (err) {
    console.error('Error deleting records:', err);
    res.status(500).send('Error deleting records.');
  }
});

// Route to add main container
router.post('/mainContainers/add', async (req, res) => {
  try {
    const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
    const sql = `INSERT INTO maincontainertable (containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType]);
    console.log("Successfully inserted data", result);
    res.json(result);
  } catch (err) {
    console.error("Error inserting main container data:", err);
    res.status(500).json({ error: "An error occurred while inserting data." });
  }
});

// Route to update main container by ID
router.put('/mainContainers/update/:id', async (req, res) => {
  try {
    const mainContainersId = req.params.id;
    const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
    const sql = `UPDATE maincontainertable SET containerName = ?, containerHeight = ?, containerWidth = ?, containerImageBitmapData = ?, subCategories = ?, printerType = ? WHERE id = ?`;
    const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType, mainContainersId]);
    console.log("Successfully updated data", result);
    res.json(result);
  } catch (err) {
    console.error("Error updating main container:", err);
    res.status(500).json({ error: "An error occurred while updating data." });
  }
});

// Route to get main container by subcategory
router.get('/mainContainers/:subCategories', async (req, res) => {
  try {
    const subCategories = req.params.subCategories;
    const sql = `SELECT id, containerName, containerHeight, containerWidth, printerType, CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData FROM maincontainertable WHERE subCategories = ?`;
    const results = await queryDB(sql, [subCategories]);
    res.json(results.length === 0 ? [] : results);
  } catch (err) {
    console.error('Error fetching data for subCategories:', subCategories, '-', err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

// Route to get main container by ID
router.get('/mainContainers/get/main/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories, printerType FROM maincontainertable WHERE id = ?`;
    const result = await queryDB(sql, [id]);
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json({ message: "No data found for the given subcategory.", data: id });
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    res.json({ message: "An error occurred while fetching data.", data: req.params.id });
  }
});


// Helper function for executing SQL queries
const queryDatabase = async (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Get all main containers
router.get('/mainContainers', async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        containerName, 
        containerHeight, 
        containerWidth, 
        CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData, 
        subCategories,
        printerType 
      FROM maincontainertable
    `;
    const results = await queryDatabase(sql);
    if (results.length === 0) {
      console.log("No data found in maincontainertable.");
      return res.json([]);
    }
    res.json(results);
  } catch (err) {
    console.error("Error fetching all main container data:", err.message);
    return res.status(500).json({ error: "An error occurred while fetching all data." });
  }
});

// Delete main container and related widget container
router.delete('/mainContainers/delete/:id', async (req, res) => {
  const mainContainersId = req.params.id;

  try {
    const sql = 'DELETE main, widget FROM maincontainertable main LEFT JOIN widgetcontainertable widget ON main.id = widget.mainContainerId WHERE main.id = ?';
    const results = await queryDatabase(sql, [mainContainersId]);
    if (results.affectedRows === 0) {
      return res.json({ message: "No data found for the provided mainContainersId.", data: mainContainersId });
    }
    return res.json({ message: "Data successfully deleted.", data: mainContainersId });
  } catch (err) {
    console.error("Error deleting data:", err.message);
    return res.status(500).json({ message: "An error occurred while deleting data.", data: mainContainersId });
  }
});

// Create a new widget container
router.post('/widgetContainers/add/', async (req, res) => {
  const { mainContainerId, type, contentData, offsetDx, offsetDy, widthSize, height, selectTimeTextScanInt, isBold, isUnderline, isItalic, fontSize, alignment, rotation, prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth, isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize } = req.body;

  const dataToStore = {
    mainContainerId,
    type,
    contentData,
    offsetDx,
    offsetDy,
    widthSize,
    height: height || null,
    selectTimeTextScanInt: selectTimeTextScanInt || null,
    isBold: isBold || 0,
    isUnderline: isUnderline || 0,
    isItalic: isItalic || 0,
    fontSize: fontSize,
    alignment: alignment || "left",
    rotation: rotation,
    prefix: prefix || null,
    suffix: suffix || null,
    selectedEmojiIcons: selectedEmojiIcons || {},
    isRectangale: isRectangale || 0,
    isRoundRectangale: isRoundRectangale || 0,
    isCircularFixed: isCircularFixed || 0,
    isCircularNotFixed: isCircularNotFixed || 0,
    sliderLineWidth: sliderLineWidth,
    isDottedLine: isDottedLine || 0,
    rowCount: rowCount || null,
    columnCount: columnCount || null,
    columnWidths: columnWidths || null,
    rowHeights: rowHeights || null,
    cellTexts: cellTexts || null,
    tableTextAlignment: tableTextAlignment || null,
    tableTextBold: tableTextBold || 0,
    tableTextUnderline: tableTextUnderline || 0,
    tableTextItalic: tableTextItalic || 0,
    tableTextFontSize: tableTextFontSize || null,
  };

  try {
    const sql = `INSERT INTO widgetcontainertable (mainContainerId, type, contentData, offsetDx, offsetDy, widthSize, height, selectTimeTextScanInt, isBold, isUnderline, isItalic, fontSize, alignment, rotation, prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth, isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await queryDatabase(sql, [
      dataToStore.mainContainerId,
      dataToStore.type,
      dataToStore.contentData,
      dataToStore.offsetDx,
      dataToStore.offsetDy,
      dataToStore.widthSize,
      dataToStore.height,
      dataToStore.selectTimeTextScanInt,
      dataToStore.isBold,
      dataToStore.isUnderline,
      dataToStore.isItalic,
      dataToStore.fontSize,
      dataToStore.alignment,
      dataToStore.rotation,
      dataToStore.prefix,
      dataToStore.suffix,
      JSON.stringify(dataToStore.selectedEmojiIcons),
      dataToStore.isRectangale,
      dataToStore.isRoundRectangale,
      dataToStore.isCircularFixed,
      dataToStore.isCircularNotFixed,
      dataToStore.sliderLineWidth,
      dataToStore.isDottedLine,
      dataToStore.rowCount,
      dataToStore.columnCount,
      dataToStore.columnWidths,
      dataToStore.rowHeights,
      dataToStore.cellTexts,
      dataToStore.tableTextAlignment,
      dataToStore.tableTextBold,
      dataToStore.tableTextUnderline,
      dataToStore.tableTextItalic,
      dataToStore.tableTextFontSize
    ]);
    console.log("Successfully inserted data", result);
    res.json(result);
  } catch (err) {
    console.error("Error inserting data:", err.message);
    res.status(500).json({ error: "An error occurred while inserting data." });
  }
});

// Get all widget containers
router.get('/widgetContainers/get', async (req, res) => {
  try {
    const sql = 'SELECT * FROM widgetcontainertable';
    const results = await queryDatabase(sql);
    if (results.length === 0) {
      console.log("No data found in widgetcontainertable.");
      return res.json([]);
    }
    res.json(results);
  } catch (err) {
    console.error("Error fetching widget container data:", err.message);
    return res.status(500).json({ error: "An error occurred while fetching widget container data." });
  }
});

// Get widget containers by main container id
router.get('/widgetContainers/getMain/:id', async (req, res) => {
  const mainContainerId = req.params.id;

  try {
    const sql = `
      SELECT id, mainContainerId, type, contentData, offsetDx, offsetDy, isBold, isUnderline, isItalic, fontSize, alignment, rotation, widthSize, height,
             selectTimeTextScanInt, prefix, suffix, 
             CONVERT(selectedEmojiIcons USING utf8) AS selectedEmojiIcons, 
             isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
             isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, 
             tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize
      FROM widgetcontainertable 
      WHERE mainContainerId = ?
    `;
    const results = await queryDatabase(sql, [mainContainerId]);
    if (results.length === 0) {
      console.log(`No data found for mainContainerId: ${mainContainerId}`);
      return res.json([]);
    }
    res.json(results);
  } catch (err) {
    console.error("Error fetching widget data:", err.message);
    return res.status(500).json({ error: "An error occurred while fetching widget data." });
  }
});

// Delete all widgets for a main container
router.delete('/widgetContainers/multiDelete/:mainId', async (req, res) => {
  const mainId = req.params.mainId;

  try {
    const sql = 'DELETE FROM widgetcontainertable WHERE mainContainerId = ?';
    const results = await queryDatabase(sql, [mainId]);
    if (results.affectedRows === 0) {
      return res.json({ message: "Data not found to delete", data: mainId });
    }
    console.log("Successfully deleted data for mainId:", mainId);
    return res.json({ message: "Data successfully deleted", data: mainId });
  } catch (err) {
    console.error("Error deleting data:", err.message);
    return res.status(500).json({ message: "An error occurred while deleting data.", data: mainId });
  }
});

module.exports = router;

