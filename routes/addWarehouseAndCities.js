// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');
// const multer = require("multer");
// const path = require("path");
// const fs = require('fs');
// const app = express();
// app.use(cors());

// router.use(express.static('public'));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images');
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const uniqueFilename = `${timestamp}_${file.originalname}`;
//     cb(null, uniqueFilename);
//   }
// });

// const upload = multer({
//   storage: storage
// });


// router.get('/icons', (req, res) => {
//   const category = req.query.categoryName;
//   if (!category) {
//     return res.status(400).json({ error: 'categoryName query parameter is required.' });
//   }
//   const query = 'SELECT * FROM icons WHERE categoryName = ?';
//   connection.query(query, [category], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icons.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/allCityName', (req, res) => {
//   const query = 'SELECT * FROM allcitynamelist WHERE 1';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving city names.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/cityNameList/:warehouseName', (req, res) => {
//   const warehouseName = req.params.warehouseName;
//   const query = 'SELECT * FROM allcitynamelist WHERE warehouseName = ?';
//   connection.query(query, [warehouseName], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving city names.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/warehouseNameList', (req, res) => {
//   const query = `SELECT * FROM allWarehouseNameList WHERE 1`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving warehouse names.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.post('/cities/add', (req, res) => {
//   const warehouseName = req.body.warehouseName;
//   const cityName = req.body.cityName;
//   const sql = "INSERT INTO allcitynamelist (cityName,warehouseName) VALUES (?,?)";
//   connection.query(sql, [cityName, warehouseName], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.json({ message: "error" });
//     }
//     return res.json({ status: "success" });
//   });
// });


// router.post('/warehouseName/add', (req, res) => {
//   const { warehouseName } = req.body;
//   const sql = 'INSERT INTO allWarehouseNameList (warehouseName) VALUES (?)';
//   connection.query(sql, [warehouseName], (err, result) => {
//     if (err) {
//       console.error('Error adding warehouseName to the database:', err);
//       res.status(500).json({ message: 'Error adding warehouseName' });
//       return;
//     }
//     res.status(201).json({ message: 'warehouseName added successfully' });
//   });
// });


// router.delete('/city/delete/:id', (req, res) => {
//   const sql = `DELETE FROM allcitynamelist WHERE id=?`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("successfully Delete", result);
//     res.json(result);
//   });
// });


// module.exports = router;


const express = require("express");
const pool = require("../config/db"); // Updated to use pool
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const router = express.Router();
const fs = require("fs");

router.use(express.static("public"));
router.use(cors());

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images are allowed."));
    }
    cb(null, true);
  },
});

// Helper function for query execution
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Routes

// GET: Retrieve all icons by category
router.get("/icons", async (req, res) => {
  const category = req.query.categoryName;
  if (!category) {
    return res.status(400).json({ error: "categoryName query parameter is required." });
  }

  try {
    const query = "SELECT * FROM icons WHERE categoryName = ?";
    const results = await executeQuery(query, [category]);
    res.status(200).json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving icons:", error);
    res.status(500).json({ error: "An error occurred while retrieving icons." });
  }
});

// GET: Retrieve all city names
router.get("/allCityName", async (req, res) => {
  try {
    const query = "SELECT * FROM allcitynamelist";
    const results = await executeQuery(query);
    res.status(200).json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving city names:", error);
    res.status(500).json({ error: "An error occurred while retrieving city names." });
  }
});

// GET: Retrieve city names by warehouse
router.get("/cityNameList/:warehouseName", async (req, res) => {
  const { warehouseName } = req.params;

  try {
    const query = "SELECT * FROM allcitynamelist WHERE warehouseName = ?";
    const results = await executeQuery(query, [warehouseName]);
    res.status(200).json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error retrieving city names:", error);
    res.status(500).json({ error: "An error occurred while retrieving city names." });
  }
});

// GET: Retrieve all warehouse names
router.get('/warehouseNameList', async (req, res) => {
  try {
    const query = `SELECT * FROM allWarehouseNameList`;
    const results = await executeQuery(query);
    res.status(200).json(results.length > 0 ? results : []);
  } catch (error) {
    console.error('Error retrieving warehouse names:', error);
    res.status(500).json({ error: 'An error occurred while retrieving warehouse names.' });
  }
});

// POST: Add a new warehouse name
router.post('/warehouseName/add', async (req, res) => {
  const { warehouseName } = req.body;

  if (!warehouseName) {
    return res.status(400).json({ error: 'warehouseName is required.' });
  }

  try {
    const query = 'INSERT INTO allWarehouseNameList (warehouseName) VALUES (?)';
    const result = await executeQuery(query, [warehouseName]);
    res.status(201).json({ message: 'Warehouse name added successfully.', id: result.insertId });
  } catch (error) {
    console.error('Error adding warehouse name:', error);
    res.status(500).json({ error: 'An error occurred while adding the warehouse name.' });
  }
});

// DELETE: Remove a city by ID
router.delete('/city/delete/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required.' });
  }

  try {
    const query = 'DELETE FROM allcitynamelist WHERE id = ?';
    const result = await executeQuery(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'City not found.' });
    }
    res.status(200).json({ message: 'City deleted successfully.' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'An error occurred while deleting the city.' });
  }
});

// POST: Add a new city
router.post("/cities/add", async (req, res) => {
  const { warehouseName, cityName } = req.body;

  if (!warehouseName || !cityName) {
    return res.status(400).json({ error: "warehouseName and cityName are required." });
  }

  try {
    const query = "INSERT INTO allcitynamelist (cityName, warehouseName) VALUES (?, ?)";
    await executeQuery(query, [cityName, warehouseName]);
    res.status(201).json({ message: "City added successfully." });
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ error: "An error occurred while adding the city." });
  }
});

module.exports = router;
