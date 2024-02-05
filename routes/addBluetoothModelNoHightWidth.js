
const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const app = express();
app.use(cors());

router.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

const upload = multer({
    storage: storage
});

//create the route and function to load all the icons according to the category name

router.get('/icons', (req, res) => {
    const category = req.query.categoryName;
    const query = `SELECT * FROM icons WHERE categoryName = '${category}'`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });

});



//create the route and function to load all the categories name

router.get('/allModelInfo', (req, res) => {

    const query = `SELECT * FROM allHightWidthList WHERE 1`;

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

router.get('/modelInfo/:modelNo', (req, res) => {
    const modelNo = req.params.modelNo; // Correctly access the categoryName parameter
    console.log(modelNo)
    const query = 'SELECT * FROM allHightWidthList WHERE modelNo = ?';

    connection.query(query, [modelNo], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });
});


router.get('/modelNoList', (req, res) => {

    const query = `SELECT * FROM allModelNoList WHERE 1`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });
});


router.post('/hightWidth/add', (req, res) => {
    const modelNo = req.body.modelNo;
    const defaultHight = req.body.defaultHight;
    const defaultWidth = req.body.defaultWidth;
    const maxHight = req.body.maxHight;
    const maxWidth = req.body.maxWidth;
    const commands = req.body.command; // Assuming 'commands' is an array of command elements
  
    // Create an array of arrays to represent the values to be inserted
    const values = commands.map((command) => [modelNo, defaultHight, defaultWidth, maxHight, maxWidth, command]);
  
    // SQL query with placeholders for multiple rows
    const sql = "INSERT INTO allHightWidthList (modelNo, defaultHight, defaultWidth, maxHight, maxWidth, command) VALUES ?";
  
    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ message: "error" });
      }
      return res.json({ status: "success" });
    });
  });
  


router.post('/modelNo/add', (req, res) => {
    const { modelNo } = req.body;

    const sql = 'INSERT INTO allModelNoList (modelNo) VALUES (?)';

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

//create the route and function to delete specific icon according to the id

router.delete('/modelInfo/delete/:id', (req, res) => {

    const sql = `DELETE FROM allHightWidthList WHERE id=?`;
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
    });



});





module.exports = router;