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
  
   
 

module.exports=router;