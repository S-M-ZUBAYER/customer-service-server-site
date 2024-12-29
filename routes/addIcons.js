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
//     return res.status(400).json({ error: 'categoryName query parameter is required' });
//   }
//   const query = `SELECT * FROM icons WHERE categoryName = ?`;
//   connection.query(query, [category], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icons.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/categories', (req, res) => {
//   const query = `SELECT * FROM allcategoris`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving categories.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/allIcons', (req, res) => {
//   console.log("Fetching all icons");
//   const query = `SELECT * FROM icons`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icons.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/icons/:categoryName', (req, res) => {
//   const categoryName = req.params.categoryName;
//   const query = 'SELECT * FROM icons WHERE categoryName = ?';
//   connection.query(query, [categoryName], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icons.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/iconCategories', (req, res) => {
//   const query = `SELECT * FROM allcategorisList WHERE 1`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icon categories.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.post('/icons/add', upload.array("images"), (req, res) => {
//   const images = req.files.map((file) => file.filename);
//   const userEmail = req.body.email;
//   const categoryName = req.body.categoryName;
//   const insertData = images.map((image) => [image, userEmail, categoryName]);

//   const sql = "INSERT INTO icons (icon, email, categoryName) VALUES ?";

//   connection.query(sql, [insertData], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.json({ message: "error" });
//     }
//     return res.json({ status: "success" });
//   });
// });


// router.post('/iconCategoriesList/add', (req, res) => {
//   const {
//     china,
//     vietnam,
//     indonesia,
//     philippines,
//     malaysia,
//     thailand,
//     english
//   } = req.body;

//   // SQL query with column names enclosed in backticks due to hyphens
//   const sql = `
//     INSERT INTO alliconcategories (
//       \`en\`,
//       \`zh\`,
//       \`vi\`,
//       \`idn\`,
//       \`fil\`,
//       \`ms\`,
//       \`th\`
//     ) VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   connection.query(sql, [
//     english,  // `en-US`
//     china,    // `zh-CN`
//     vietnam,  // `vi-VN`
//     indonesia, // `id-ID`
//     philippines, // `fil-PH`
//     malaysia,   // `ms-MY`
//     thailand   // `th-TH`
//   ], (err) => {
//     if (err) return res.status(500).json({ message: 'Error adding category' });
//     res.status(201).json({ message: 'Category added successfully' });
//   });
// });


// router.get('/iconCategoriesList', (req, res) => {
//   const query = `SELECT * FROM alliconcategories WHERE 1`;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving icon categories list.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.post('/iconCategories/add', (req, res) => {
//   const { categoryName } = req.body;
//   console.log(categoryName)
//   const sql = 'INSERT INTO allcategorisList (allIconsCategoris) VALUES (?)';
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
// router.delete('/icons/delete/:id', (req, res) => {
//   const iconId = req.params.id;
//   const sql = `SELECT * FROM icons WHERE id = ?`;
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
//     const filePath = `public/images/${icon.icon}`;
//     fs.unlink(filePath, function (err) {
//       if (err) {
//         console.error('Error deleting file:', err);
//         res.status(500).send('Error deleting file');
//         return;
//       }
//       const deleteSql = `DELETE FROM icons WHERE id = ?`;
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
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware
router.use(cors());
router.use(express.static("public"));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Utility Function for Query Execution
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Routes
router.get("/icons", async (req, res) => {
  try {
    const category = req.query.categoryName;
    if (!category) {
      return res.status(400).json({ error: "categoryName query parameter is required" });
    }
    const query = "SELECT * FROM icons WHERE categoryName = ?";
    const results = await executeQuery(query, [category]);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching icons:", error);
    res.status(500).json({ error: "An error occurred while retrieving icons." });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const query = "SELECT * FROM allcategoris";
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "An error occurred while retrieving categories." });
  }
});

router.get("/allIcons", async (req, res) => {
  try {
    const query = "SELECT * FROM icons";
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching all icons:", error);
    res.status(500).json({ error: "An error occurred while retrieving icons." });
  }
});

router.get("/icons/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const query = "SELECT * FROM icons WHERE categoryName = ?";
    const results = await executeQuery(query, [categoryName]);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching icons by category:", error);
    res.status(500).json({ error: "An error occurred while retrieving icons." });
  }
});

router.get("/iconCategories", async (req, res) => {
  try {
    const query = "SELECT * FROM allcategorisList WHERE 1";
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching icon categories:", error);
    res.status(500).json({ error: "An error occurred while retrieving icon categories." });
  }
});

router.post("/icons/add", upload.array("images"), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename);
    const { email, categoryName } = req.body;
    const insertData = images.map((image) => [image, email, categoryName]);

    const query = "INSERT INTO icons (icon, email, categoryName) VALUES ?";
    await executeQuery(query, [insertData]);

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error adding icons:", error);
    res.status(500).json({ message: "error" });
  }
});

router.post("/iconCategoriesList/add", async (req, res) => {
  try {
    const { china, vietnam, indonesia, philippines, malaysia, thailand, english } = req.body;
    const query = `INSERT INTO alliconcategories (en, zh, vi, idn, fil, ms, th) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await executeQuery(query, [english, china, vietnam, indonesia, philippines, malaysia, thailand]);
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding category" });
  }
});

router.get("/iconCategoriesList", async (req, res) => {
  try {
    const query = "SELECT * FROM alliconcategories WHERE 1";
    const results = await executeQuery(query);
    res.json(results.length > 0 ? results : []);
  } catch (error) {
    console.error("Error fetching icon categories list:", error);
    res.status(500).json({ error: "An error occurred while retrieving icon categories list." });
  }
});

router.post("/iconCategories/add", async (req, res) => {
  try {
    const { categoryName } = req.body;
    const query = "INSERT INTO allcategorisList (allIconsCategoris) VALUES (?)";

    await executeQuery(query, [categoryName]);
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding icon category:", error);
    res.status(500).json({ message: "Error adding category" });
  }
});

router.delete("/icons/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const selectQuery = "SELECT * FROM icons WHERE id = ?";
    const icon = await executeQuery(selectQuery, [id]);

    if (icon.length === 0) {
      return res.status(404).send("Icon not found");
    }

    const filePath = path.join("public/images", icon[0].icon);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send("Error deleting file");
      }

      const deleteQuery = "DELETE FROM icons WHERE id = ?";
      await executeQuery(deleteQuery, [id]);
      res.json({ message: "Icon deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting icon:", error);
    res.status(500).send("Error deleting icon");
  }
});

module.exports = router;
