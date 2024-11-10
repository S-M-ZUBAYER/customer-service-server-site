
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

router.get('/categories', (req, res) => {
  const query = `SELECT * FROM allcategoris WHERE 1`;

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

router.get('/allIcons', (req, res) => {
  console.log("icons")
  const query = `SELECT * FROM icons WHERE 1`;

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

router.get('/icons/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName; // Correctly access the categoryName parameter
  console.log(categoryName);
  const query = 'SELECT * FROM icons WHERE categoryName = ?';

  connection.query(query, [categoryName], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});


router.get('/iconCategories', (req, res) => {

  const query = `SELECT * FROM allcategorisList WHERE 1`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});


router.post('/icons/add', upload.array("images"), (req, res) => {
  const images = req.files.map((file) => file.filename);
  const userEmail = req.body.email; // Corrected from email to userEmail
  const categoryName = req.body.categoryName;

  const insertData = images.map((image) => [image, userEmail, categoryName]);

  const sql = "INSERT INTO icons (icon, email, categoryName) VALUES ?";

  connection.query(sql, [insertData], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ message: "error" });
    }
    return res.json({ status: "success" });
  });
});

router.post('/iconCategoriesList/add', (req, res) => {
  console.log("click");

  const {
    china,
    vietnam,
    indonesia,
    philippines,
    malaysia,
    thailand,
    english
  } = req.body;
  console.log({
    china,
    vietnam,
    indonesia,
    philippines,
    malaysia,
    thailand,
    english
  });

  // SQL query with column names enclosed in backticks due to hyphens
  const sql = `
    INSERT INTO alliconcategories (
      \`en\`,
      \`zh\`,
      \`vi\`,
      \`idn\`,
      \`fil\`,
      \`ms\`,
      \`th\`
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [
    english,  // `en-US`
    china,    // `zh-CN`
    vietnam,  // `vi-VN`
    indonesia, // `id-ID`
    philippines, // `fil-PH`
    malaysia,   // `ms-MY`
    thailand   // `th-TH`
  ], (err) => {
    if (err) return res.status(500).json({ message: 'Error adding category' });
    res.status(201).json({ message: 'Category added successfully' });
  });
});


router.get('/iconCategoriesList', (req, res) => {

  const query = `SELECT * FROM alliconcategories WHERE 1`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});


router.post('/iconCategories/add', (req, res) => {
  const { categoryName } = req.body;
  console.log(categoryName)
  const sql = 'INSERT INTO allcategorisList (allIconsCategoris) VALUES (?)';

  connection.query(sql, [categoryName], (err, result) => {
    if (err) {
      console.error('Error adding category to the database:', err);
      res.status(500).json({ message: 'Error adding category' });
      return;
    }
    console.log('Category added to the database');
    res.status(201).json({ message: 'Category added successfully' });
  });
});

//create the route and function to delete specific icon according to the id

router.delete('/icons/delete/:id', (req, res) => {
  const iconId = req.params.id;

  const sql = `SELECT * FROM icons WHERE id = ?`;
  connection.query(sql, [iconId], function (err, rows) {
    if (err) {
      console.error('Error retrieving icon:', err);
      res.status(500).send('Error retrieving icon');
      return;
    }

    if (rows.length === 0) {
      res.status(404).send('Icon not found');
      return;
    }

    const icon = rows[0];

    //start from here to unlink and delete the file from the folder

    const filePath = `public/images/${icon.icon}`;


    fs.unlink(filePath, function (err) {
      if (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
        return;
      }

      const deleteSql = `DELETE FROM icons WHERE id = ?`;
      connection.query(deleteSql, [iconId], function (err, result) {
        if (err) {
          console.error('Error deleting icon from database:', err);
          res.status(500).send('Error deleting icon from database');
          return;
        }

        console.log('Icon deleted successfully');
        res.json(result);
      });
    });
  });
});


module.exports = router;