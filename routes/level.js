const express =require("express");
const connection = require("../config/db");
const router=express.Router();
const cors = require('cors');
const Blob = require('blob');

//Require multer for upload different files
const multer =require("multer")

//Require path to view file file according to the path
const path= require("path")

//Require fs to unlink the file at the time to update and delete
const fs = require('fs');
const { base64StringToBlob } = require("blob-util");

const app=express();
app.use(cors());




  
  
    
//create the route and function to add Category name 
 
router.post('/labelCategories/add', (req, res) => {
  const categoryName = req.body.categoryName; // Extract the category name from the request body
  const subCategoryName = req.body.subCategoryName || []; // Extract the subcategory names or default to an empty array

  let sql = `INSERT INTO alllevelcategories (allCategories, subCategories) VALUES (?, ?)`;

  connection.query(sql, [categoryName, JSON.stringify(subCategoryName)], function(err, result) {
    if (err) {
      console.error("Error inserting category name and subcategories:", err);
      res.status(500).json({ error: "An error occurred while inserting category name and subcategories." });
    } else {
      console.log("Successfully inserted category name and subcategories", result);
      res.json(result);
    }
  });
});


//create the route and function to update the subCategory Name under the  Category name 


router.put('/labelCategories/update/:id', (req, res) => {
    const categoryId = req.params.id; // Extract the category ID from the request parameters
    const updatedCategoryName = req.body.updatedCategoryName; // Extract the updated category name from the request body
  
    let sql = `UPDATE alllevelcategories SET allCategories = ? WHERE id = ?`;
  
    connection.query(sql, [updatedCategoryName, categoryId], function(err, result) {
      if (err) {
        console.error("Error updating category name:", err);
        res.status(500).json({ error: "An error occurred while updating category name." });
      } else {
        console.log("Successfully updated category name", result);
        res.json(result);
      }
    });
  });
  

// router.put('/labelSubCategories/update/:id', (req, res) => {
//   const categoryId = req.params.id; // Extract the category ID from the request parameters
//   const subCategoryName = req.body.subCategoryName || []; // Extract the updated subcategory names or default to an empty array

//   let sql = `UPDATE alllevelcategories SET subCategories = ? WHERE id = ?`;

//   connection.query(sql, [JSON.stringify(subCategoryName), categoryId], function(err, result) {
//     if (err) {
//       console.error("Error updating subcategories:", err);
//       res.status(500).json({ error: "An error occurred while updating subcategories." });
//     } else {
//       console.log("Successfully updated subcategories", result);
//       res.json(result);
//     }
//   });
// });



//create the route and function to Edit the subCategory Name under the  Category name 

router.put('/labelSubCategories/update/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName; // Extract the category name from the URL parameters
    const subCategoryName = req.body.subCategoryName || []; // Extract the updated subcategory names or default to an empty array
  

    let sql = `UPDATE alllevelcategories SET subCategories = ? WHERE allCategories = ?`;
  
    connection.query(sql, [JSON.stringify(subCategoryName), categoryName], function(err, result) {
      if (err) {
        console.error("Error updating subcategories based on category name:", err);
        res.status(500).json({ error: "An error occurred while updating subcategories based on category name." });
      } else {
        console.log("Successfully updated subcategories based on category name", result);
        res.json(result);
      }
    });
  });


  
//create the route and function to get all category name and subCategory Name 

router.get('/labelCategories', (req, res) => {
    let sql = `SELECT * FROM alllevelcategories`;
  
    connection.query(sql, function(err, results) {
      if (err) {
        console.error("Error fetching all data:", err);
        res.status(500).json({ error: "An error occurred while fetching all data." });
      } else {
        console.log("Successfully fetched all data", results);
        res.json(results);
      }
    });
  });



//create the route and function to add the labelList and LabelView Name under the  SubCategory name 
router.post('/allLabelData/add', (req, res) => {
    const { subCategoryName, labelDataList, LabelDataView } = req.body;
  
    const dataToStore = {
      subCategoryName,
      labelDataList: labelDataList || {}, // Default to an empty object if not provided
      LabelDataView: LabelDataView || {} // Default to an empty object if not provided
    };
  
    let sql = `INSERT INTO alllabeldata (subCategoryName, labelDataList, LabelDataView) VALUES (?, ?, ?)`;
  
    connection.query(sql, [dataToStore.subCategoryName, JSON.stringify(dataToStore.labelDataList), JSON.stringify(dataToStore.LabelDataView)], function(err, result) {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
      } else {
        console.log("Successfully inserted data", result);
        res.json(result);
      }
    });
  });


//create the route and function to update the subCategory Name and all the label information
  router.put('/allLabelData/update/:id', (req, res) => {
    const categoryId = req.params.id; // Extract the category ID from the request parameters
    const { subCategoryName, labelDataList, LabelDataView } = req.body;
  
    const dataToUpdate = {
      subCategoryName,
      labelDataList: labelDataList || {},
      LabelDataView: LabelDataView || {}
    };
  
    let sql = `UPDATE alllabeldata SET subCategoryName = ?, labelDataList = ?, LabelDataView = ? WHERE id = ?`;
  
    connection.query(sql, [dataToUpdate.subCategoryName, JSON.stringify(dataToUpdate.labelDataList), JSON.stringify(dataToUpdate.LabelDataView), categoryId], function(err, result) {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "An error occurred while updating data." });
      } else {
        console.log("Successfully updated data", result);
        res.json(result);
      }
    });
  });



//create the route and function to get the all data information about a SubCategory label information
  router.get('/allLabelData', (req, res) => {
    let sql = `SELECT * FROM alllabeldata`;
  
    connection.query(sql, function(err, results) {
      if (err) {
        console.error("Error fetching all data:", err);
        res.status(500).json({ error: "An error occurred while fetching all data." });
      } else {
        console.log("Successfully fetched all data", results);
        res.json(results);
      }
    });
  });

  
//create the route and function to get the label information under the Sub Category name 

  router.get('/allLabelData/:subCategoryName', (req, res) => {
    const subCategoryName = req.params.subCategoryName;
  
    let sql = `SELECT * FROM alllabeldata WHERE subCategoryName = ?`;
  
    connection.query(sql, [subCategoryName], function(err, results) {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "An error occurred while fetching data." });
      } else {
        console.log("Successfully fetched data", results);
        res.json(results);
      }
    });
  });


  router.delete('/allLabelData/deleteByMyId/:myid', (req, res) => {
    const myid = req.params.myid;
    
    const sql = `DELETE FROM alllabeldata WHERE JSON_UNQUOTE(JSON_EXTRACT(labelDataView, '$.myid')) = ?`;
    
    connection.query(sql, [myid], function (err, result) {
      if (err) {
        console.error('Error deleting records:', err);
        res.status(500).send('Error deleting records.');
      } else {
        console.log(`Successfully deleted records with myid ${myid}`);
        res.json(result);
      }
    });
  });
  
   








//new  code for maincontainers table and  widgetcontainertable   



router.post('/mainContainers/add', (req, res) => {
  const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories } = req.body;

  const dataToStore = {
    containerName,
    containerHeight, // Default to an empty object if not provided
    containerWidth,
    containerImageBitmapData, // No default needed since it's binary data
    subCategories // Default to an empty object if not provided
  };

  // Use placeholders for the BLOB data and prepare the SQL statement
  let sql = `INSERT INTO maincontainertable (containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories) VALUES (?, ?, ?, ?, ?)`;

  connection.query(sql, [dataToStore.containerName, dataToStore.containerHeight, dataToStore.containerWidth, JSON.stringify(dataToStore.containerImageBitmapData), dataToStore.subCategories], function(err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "An error occurred while inserting data." });
    } else {
      console.log("Successfully inserted data", result);
      res.json(result);
    }
  });
});



// Update a MainContainer by its ID

router.put('/mainContainers/update/:id', (req, res) => {
  const mainContainersId = req.params.id; // Extract the category ID from the request parameters
  const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories } = req.body;

  const dataToStore = {
    containerName,
    containerHeight, // Default to an empty object if not provided
    containerWidth, // Default to an empty object if not provided
    containerImageBitmapData: containerImageBitmapData || null, // Default to an empty object if not provided
    subCategories, // Default to an empty object if not provided
  };
  let sql = `UPDATE maincontainertable SET containerName = ?, containerHeight = ?, containerWidth = ?, containerImageBitmapData = ?, subCategories = ? WHERE id = ?`;

  connection.query(sql, [dataToStore.containerName, dataToStore.containerHeight, dataToStore.containerWidth, JSON.stringify(dataToStore.containerImageBitmapData), dataToStore.subCategories, mainContainersId], function(err, result) {
    if (err) {
      console.error("Error updating data:", err);
      res.status(500).json({ error: "An error occurred while updating data." });
    } else {
      console.log("Successfully updated data", result);
      res.json(result);
    }
  });
});




// Get a MainContainer by its ID 




router.get('/mainContainers/:subCategories', (req, res) => {
  const subCategories = req.params.subCategories;

  let sql = `SELECT id,containerName,containerHeight,containerWidth,convert(containerImageBitmapData using utf8) as containerImageBitmapData FROM maincontainertable WHERE subCategories = ?`;

  connection.query(sql, [subCategories], function(err, results) {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      if (results.length > 0) {
    


    res.json(results);

      } else {
        res.status(404).json({ error: "No data found for the given subcategory." });
      }
    }
  });
});




// Get a MainContainer by its mainContainersID 

router.get('/mainContainers/get/main/:id', (req, res) => {
  const id = req.params.id;
  console.log(id,"skjdf")

  let sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories FROM maincontainertable WHERE id = ?`;

  connection.query(sql, [id], function(err, results) {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: "No data found for the given subcategory." });
      }
    }
  });
});


router.get('/mainContainers', (req, res) => {
  let sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories FROM maincontainertable`;

  connection.query(sql, function(err, results) {
    if (err) {
      console.error("Error fetching all data:", err);
      res.status(500).json({ error: "An error occurred while fetching all data." });
    } else {
      console.log("Successfully fetched all data", results);
      res.json(results);
    }
  });
});



router.delete('/mainContainers/delete/:id', (req, res) => {
  const mainContainersId = req.params.id;
  
  let sql = ('DELETE main, widget FROM maincontainertable main LEFT JOIN widgetcontainertable widget ON main.id = widget.mainContainerId WHERE main.id = ?');


  connection.query(sql, [mainContainersId] ,function(err, results) {
    if (err) {
      console.error("Error fetching all data:", err);
      res.status(500).json({ error: "An error occurred while fetching all data." });
    } else {
      console.log("Successfully fetched all data", results);
      res.json(results);
    }
  });
});




// Create a new WidgetContainer

router.post('/widgetContainers/add/', (req, res) => {
  const { mainContainerId, type, contentData, offsetDx, offsetDy, widthSize, height, isBold, isUnderline, isItalic, fontSize, alignment, rotation,  prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth, isDottedLine, rowCount, columnCount } = req.body;

  const dataToStore = {
    mainContainerId,
    type,
    contentData,
    offsetDx,
    offsetDy,
    widthSize,

    height:height || null,
    isBold:isBold || 0,
    isUnderline:isUnderline || 0,
    isItalic:isItalic || 0,
    fontSize:fontSize,
    alignment:alignment || "left",
    rotation:rotation,
    prefix:prefix || null,
    suffix: suffix || null,
    selectedEmojiIcons: selectedEmojiIcons || {},
    isRectangale:isRectangale || 0,
    isRoundRectangale:isRoundRectangale || 0,
    isCircularFixed:isCircularFixed || 0,
    isCircularNotFixed:isCircularNotFixed || 0,
    sliderLineWidth: sliderLineWidth,
    isDottedLine:isDottedLine || 0,
    rowCount:rowCount || null,
    columnCount:columnCount| null
  };

  let sql = `INSERT INTO widgetcontainertable (mainContainerId, type, contentData, offsetDx, offsetDy,widthSize,  height, isBold, isUnderline, isItalic, fontSize, alignment, rotation,  prefix, suffix, selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
    isDottedLine, rowCount, columnCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  connection.query(sql, [
    dataToStore.mainContainerId,
    dataToStore.type,
    dataToStore.contentData,
    dataToStore.offsetDx,
    dataToStore.offsetDy,
    dataToStore.widthSize,
    dataToStore.height,
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
    ], function(err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "An error occurred while inserting data." });
    } else {
      console.log("Successfully inserted data", result);
      res.json(result);
    }
  });
});


// Get a widgetContainers

router.get('/widgetContainers/get/', (req, res) => {
  let sql = `SELECT * FROM widgetcontainertable`;

  connection.query(sql, function(err, results) {

    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      console.log("Successfully fetched data", results);
      res.json(results);
    }
  });
});


// Get a widgetContainers by its ID 

router.get('/widgetContainers/getMain/:id', (req, res) => {
  const mainContainerId = req.params.id;

  //let sql = `SELECT * FROM widgetcontainertable WHERE mainContainerId = ?`;//convert(containerImageBitmapData using utf8) as containerImageBitmapData
  let sql = `SELECT id,mainContainerId, type, contentData, offsetDx, offsetDy, isBold, isUnderline,  isItalic, fontSize, alignment, rotation, widthSize,  height,  prefix, suffix, convert(selectedEmojiIcons using utf8) as selectedEmojiIcons, isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
  isDottedLine, rowCount, columnCount FROM widgetcontainertable WHERE mainContainerId = ?`;
  connection.query(sql, [mainContainerId], function(err, results) {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      console.log("Successfully fetched data", results);
      res.json(results);
    }
  });
});

// end here the Sultans code ............

router.delete('/widgetContainers/multiDelete/:mainId', (req, res) => {
  const mainId = req.params.mainId;
  console.log(mainId)

  const sql = `DELETE FROM widgetcontainertable WHERE mainContainerId = ?`;

  connection.query(sql, [mainId], function (err, results) {
    if (err) {
      console.error("Error deleting data:", err);
      res.status(500).json({ error: "An error occurred while deleting data." });
    } else {
      console.log("Successfully deleted data", results);
      res.json(results);
    }
  });
});
 

module.exports=router;