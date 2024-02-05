
const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const path = require("path");
const fs = require('fs');

const app = express();
app.use(cors());




//create the route and function to load all the categories name

router.get('/allWifiModelList', (req, res) => {

    const query = `SELECT * FROM allwifimodelnolist WHERE 1`;

    connection.query(query, (error, results) => {
        if (results) {
            res.json(results);
        }
        else {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });
});

router.get('/wifiModelList/:modelNo', (req, res) => {
    const modelNo = req.params.modelNo; // Correctly access the categoryName parameter
    const query = 'SELECT * FROM allWifiModelHightWidthList WHERE modelNo = ?';

    connection.query(query, [modelNo], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });
});


router.get('/allWifiModelInfo', (req, res) => {

    const query = `SELECT * FROM allWifiModelHightWidthList WHERE 1`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });
});



router.post('/wifiModelNo/add', (req, res) => {
    const { modelNo } = req.body;

    const sql = 'INSERT INTO allwifimodelnolist (modelNo) VALUES (?)';

    connection.query(sql, [modelNo], (err, result) => {
        if (err) {
            console.error('Error adding modelNo to the database:', err);
            res.status(500).json({ message: 'Error adding modelNo' });
            return;
        }
        console.log('modelNo added to the database');
        res.status(201).json({ message: 'modelNo added successfully' });
    });
});


  router.post('/wifiModelHightWidth/add', (req, res) => {
    const { PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type } = req.body;
  
    // SQL query with placeholders for a single row
    const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
    connection.query(sql, [PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ message: "error" });
      }
      return res.json({ status: "success" });
    });
});

  
  router.post('/wifiModelHightWidth/add', (req, res) => {
    const { PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type } = req.body;

    // Input validation
    if (!PID || !modelNo || !defaultHight || !defaultWidth || !maxHight || !maxWidth || !type) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Create an array of arrays to represent the values to be inserted
    const values = [[PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type]];

    // SQL query with placeholders for multiple rows
    const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type) VALUES ?";

    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "An error occurred while inserting data." });
        }
        return res.status(200).json({ status: "success" });
    });
});




//create the route and function to delete specific icon according to the id

router.delete('/wifiModelInfo/delete/:id', (req, res) => {

    const sql = `DELETE FROM allwifimodelnolist WHERE id=?`;
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
    });



});

//create the route and function to delete specific icon according to the id

router.delete('/wifiModelList/delete/:id', (req, res) => {

    const sql = `DELETE FROM allWifiModelHightWidthList WHERE id=?`;
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
    });



});





module.exports = router;