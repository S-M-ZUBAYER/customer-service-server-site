
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

  router.get('/allCityName', (req, res) => {
   
    const query = `SELECT * FROM allcitynamelist WHERE 1`;
    
    connection.query(query, (error, results) => {
      if(results) {
        res.json(results);
      }
    else {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } 
    });
  });
    
  router.get('/cityNameList/:warehouseName', (req, res) => {
    const warehouseName = req.params.warehouseName; // Correctly access the categoryName parameter
    const query = 'SELECT * FROM allcitynamelist WHERE warehouseName = ?';
  
    connection.query(query, [warehouseName], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(results);
      }
    });
  });


router.get('/warehouseNameList', (req, res) => {

  const query = `SELECT * FROM allWarehouseNameList WHERE 1`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});


router.post('/cities/add', (req, res) => {
  const warehouseName = req.body.warehouseName;
  const cityName=req.body.cityName;

  console.log(warehouseName,cityName)

  const sql = "INSERT INTO allcitynamelist (cityName,warehouseName) VALUES (?,?)";
  
  connection.query(sql, [cityName,warehouseName], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ message: "error" });
    }
    return res.json({ status: "success" });
  });
});


    router.post('/warehouseName/add', (req, res) => {
      const { warehouseName } = req.body;
    
      const sql = 'INSERT INTO allWarehouseNameList (warehouseName) VALUES (?)';
    
      connection.query(sql, [warehouseName], (err, result) => {
        if (err) {
          console.error('Error adding warehouseName to the database:', err);
          res.status(500).json({ message: 'Error adding warehouseName' });
          return;
        }
        console.log('warehouseName added to the database');
        res.status(201).json({ message: 'warehouseName added successfully' });
      });
    });

//create the route and function to delete specific icon according to the id

router.delete('/city/delete/:id', (req, res) => {
  
      const sql = `DELETE FROM allcitynamelist WHERE id=?`;
      connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
      });

     
   
});





module.exports=router;