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
//     cb(null, 'public/backgroundImgs');
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


// router.get('/backgroundImgs/:categoryName', (req, res) => {
//   const categoryName = req.params.categoryName;
//   const query = 'SELECT * FROM backgroundImgs WHERE categoryName = ?';
//   connection.query(query, [categoryName], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });



// router.get('/BackgroundCategories', (req, res) => {
//   const query = `SELECT * FROM allbackgroundcategoris WHERE 1`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/allBackgroundImgs', (req, res) => {
//   const query = `SELECT * FROM backgrounds WHERE 1`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.post('/backgroundImgs/add', upload.array("images"), (req, res) => {
//   const images = req.files.map((file) => file.filename);
//   const userEmail = req.body.email;
//   const categoryName = req.body.categoryName;
//   const height = req.body.height;
//   const width = req.body.width;
//   const insertData = images.map((image) => [image, userEmail, categoryName, height, width]);
//   const sql = "INSERT INTO backgroundImgs (image, userEmail, categoryName,height,width) VALUES ?";

//   connection.query(sql, [insertData], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.json({ message: "error" });
//     }
//     return res.json({ status: "success" });
//   });
// });


// router.post('/BackgroundCategories/add', (req, res) => {
//   const { categoryName } = req.body;
//   const sql = 'INSERT INTO allbackgroundcategoris (allBackgroundCategoris) VALUES (?)';
//   connection.query(sql, [categoryName], (err, result) => {
//     if (err) {
//       console.error('Error adding category to the database:', err);
//       res.status(500).json({ message: 'Error adding category' });
//       return;
//     }
//     console.log('Category added to the database');
//     res.status(201).json({ message: 'Category added successfully' });
//   });
// });


// //create the route and function to delete specific icon according to the id
// router.delete('/backgroundImgs/delete/:id', (req, res) => {
//   const iconId = req.params.id;
//   const sql = `SELECT * FROM backgroundimgs WHERE id = ?`;
//   connection.query(sql, [iconId], function (err, rows) {
//     if (err) {
//       console.error('Error retrieving icon:', err);
//       res.status(500).send('Error retrieving icon');
//       return;
//     }
//     if (rows.length === 0) {
//       res.status(404).send('Icon not found');
//       return;
//     }
//     const icon = rows[0];
//     const filePath = `public/backgroundImgs/${icon.image}`;
//     fs.unlink(filePath, function (err) {
//       if (err) {
//         console.error('Error deleting file:', err);
//         res.status(500).send('Error deleting file');
//         return;
//       }
//       const deleteSql = `DELETE FROM backgroundImgs WHERE id = ?`;
//       connection.query(deleteSql, [iconId], function (err, result) {
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
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const app = express();
app.use(cors());

router.use(express.static('public'));

// Multer storage configuration for uploading images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/backgroundImgs');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

// Function to handle query execution
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// GET route to fetch background images by category
router.get('/backgroundImgs/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  const query = 'SELECT * FROM backgroundImgs WHERE categoryName = ?';
  try {
    const results = await executeQuery(query, [categoryName]);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error('Error retrieving background images:', error);
    res.status(500).json({ error: 'An error occurred while retrieving background images' });
  }
});

// GET route to fetch all background categories
router.get('/BackgroundCategories', async (req, res) => {
  const query = 'SELECT * FROM allbackgroundcategoris';
  try {
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'An error occurred while retrieving categories' });
  }
});

// GET route to fetch all background images
router.get('/allBackgroundImgs', async (req, res) => {
  const query = 'SELECT * FROM backgrounds';
  try {
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error('Error retrieving all background images:', error);
    res.status(500).json({ error: 'An error occurred while retrieving all background images' });
  }
});

// POST route to add background images
router.post('/backgroundImgs/add', upload.array("images"), async (req, res) => {
  const images = req.files.map((file) => file.filename);
  const { email, categoryName, height, width } = req.body;

  if (!email || !categoryName || !height || !width || images.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertData = images.map((image) => [image, email, categoryName, height, width]);
  const sql = 'INSERT INTO backgroundImgs (image, userEmail, categoryName, height, width) VALUES ?';

  try {
    await executeQuery(sql, [insertData]);
    res.json({ status: "success" });
  } catch (error) {
    console.error('Error inserting background images:', error);
    res.status(500).json({ error: 'An error occurred while adding images' });
  }
});

// POST route to add new background category
router.post('/BackgroundCategories/add', async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const sql = 'INSERT INTO allbackgroundcategoris (allBackgroundCategoris) VALUES (?)';

  try {
    await executeQuery(sql, [categoryName]);
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'An error occurred while adding category' });
  }
});

// DELETE route to delete background image by id
router.delete('/backgroundImgs/delete/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM backgroundImgs WHERE id = ?';

  try {
    const rows = await executeQuery(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = rows[0];
    const filePath = `public/backgroundImgs/${image.image}`;

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Error deleting file from the server' });
      }

      const deleteSql = 'DELETE FROM backgroundImgs WHERE id = ?';
      await executeQuery(deleteSql, [id]);

      res.json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting background image:', error);
    res.status(500).json({ error: 'An error occurred while deleting the image' });
  }
});

module.exports = router;
