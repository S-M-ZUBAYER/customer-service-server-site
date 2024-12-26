// const express = require("express")
// const connection = require("../config/db")
// const router = express.Router()
// const cors = require("cors");
// const fs = require('fs');

// const app = express();
// app.use(cors());
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
// const multer = require("multer")
// const path = require("path");
// const { route } = require("./users");

// // Set the specific folder to show the file
// router.use(express.static('public'))

// //create the structure to upload the file with specific name
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/showingVideos')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//   }
// })


// //declare the multer
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 100 * 1024 * 1024 } // Adjust the limit to handle up to 70MB
// });


// router.post('/showingVideo/add', upload.single('showingVideo'), (req, res) => {
//   const { title, country } = req.body;
//   if (!req.file) {
//     return res.status(400).json({ status: 'error', message: 'No showing video uploaded' });
//   }
//   const showingVideo = req.file;
//   const showingVideoData = {
//     country,
//     title,
//     showingVideo: showingVideo ? showingVideo.filename : null,
//   };


//   // Insert the data into the database
//   connection.query(
//     'INSERT INTO showingVideos (title,countryName, showingVideo, imgPath) VALUES (?, ?, ?, ?)',
//     [
//       title,
//       country,
//       showingVideo.filename,
//       'https://grozziieget.zjweiting.com:8033/tht/showingVideos/',
//     ],
//     (error, results) => {
//       if (error) {
//         console.error('Error creating showing video:', error);
//         res.status(500).json({ status: 'error', message: 'Error creating showing video' });
//       } else {
//         console.log('showing video created successfully');
//         res.status(200).json({ status: 'success', message: 'showing video created successfully' });
//       }
//     }
//   );
// });


// router.get('/showingVideo', (req, res) => {
//   connection.query('SELECT * FROM showingVideos', (error, results) => {
//     if (error) {
//       console.error('Error retrieving showing videos:', error);
//       return res.status(500).json({ status: 'error', message: 'An error occurred while retrieving showing videos' });
//     }
//     res.json(results.length > 0 ? { status: 'success', data: results } : { status: 'not found', message: 'No showing videos found' });
//   });
// });



// router.get('/showingVideo/:country', (req, res) => {
//   const { country } = req.params;
//   if (!country) {
//     return res.status(400).json({ status: 'error', message: 'Country parameter is required' });
//   }
//   connection.query(
//     'SELECT * FROM showingVideos WHERE countryName = ?',
//     [country],
//     (error, results) => {
//       if (error) {
//         console.error('Error retrieving showing video:', error);
//         return res.status(500).json({ status: 'error', message: 'An error occurred while retrieving showing video' });
//       }
//       res.json(results.length > 0 ? { status: 'success', data: results } : { status: 'not found', message: 'No showing videos found for the given country' });
//     }
//   );
// });


// router.delete('/showingVideo/delete/:id', (req, res) => {
//   const showingVideoId = req.params.id;
//   const sql = 'SELECT * FROM showingVideos WHERE id = ?';
//   connection.query(sql, [showingVideoId], (error, rows) => {
//     if (error) {
//       console.error('Error retrieving showing video:', error);
//       return res.status(500).json({ status: 'error', message: 'Error retrieving showing video' });
//     }
//     if (rows.length === 0) {
//       return res.status(404).json({ status: 'not found', message: 'Showing video not found' });
//     }
//     const showingVideo = rows[0];
//     const filePath = `public/showingVideos/${showingVideo.showingVideo}`;

//     // Delete the file from the server
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         console.error('Error deleting file:', err);
//         return res.status(500).json({ status: 'error', message: 'Error deleting file' });
//       }

//       // Delete the showing video entry from the database
//       const deleteSql = 'DELETE FROM showingVideos WHERE id = ?';
//       connection.query(deleteSql, [showingVideoId], (dbError, result) => {
//         if (dbError) {
//           console.error('Error deleting showing video from database:', dbError);
//           return res.status(500).json({ status: 'error', message: 'Error deleting showing video from database' });
//         }

//         return res.status(200).json({ status: 'success', message: 'Showing video deleted successfully' });
//       });
//     });
//   });
// });



// module.exports = router;


const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

// Middleware setup
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Serve static files
router.use(express.static("public"));

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/showingVideos");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize multer for file handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file size limit
});

// Utility function for handling database queries
const queryDatabase = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Route to add a showing video
router.post("/showingVideo/add", upload.single("showingVideo"), async (req, res) => {
  try {
    const { title, country } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No showing video uploaded" });
    }

    const showingVideo = req.file;
    const showingVideoData = {
      country,
      title,
      showingVideo: showingVideo.filename,
    };

    const query = 'INSERT INTO showingVideos (title, countryName, showingVideo, imgPath) VALUES (?, ?, ?, ?)';
    await queryDatabase(query, [
      title,
      country,
      showingVideo.filename,
      'https://grozziieget.zjweiting.com:8033/tht/showingVideos/',
    ]);
    res.status(200).json({ status: "success", message: "Showing video created successfully" });
  } catch (error) {
    console.error("Error creating showing video:", error);
    res.status(500).json({ status: "error", message: "Error creating showing video" });
  }
});

// Route to get all showing videos
router.get("/showingVideo", async (req, res) => {
  try {
    const results = await queryDatabase("SELECT * FROM showingVideos");
    if (results.length > 0) {
      res.json({ status: "success", data: results });
    } else {
      res.json({ status: "not found", message: "No showing videos found" });
    }
  } catch (error) {
    console.error("Error retrieving showing videos:", error);
    res.status(500).json({ status: "error", message: "An error occurred while retrieving showing videos" });
  }
});

// Route to get showing videos by country
router.get("/showingVideo/:country", async (req, res) => {
  const { country } = req.params;
  if (!country) {
    return res.status(400).json({ status: "error", message: "Country parameter is required" });
  }
  try {
    const results = await queryDatabase("SELECT * FROM showingVideos WHERE countryName = ?", [country]);
    if (results.length > 0) {
      res.json({ status: "success", data: results });
    } else {
      res.json({ status: "not found", message: "No showing videos found for the given country" });
    }
  } catch (error) {
    console.error("Error retrieving showing video:", error);
    res.status(500).json({ status: "error", message: "An error occurred while retrieving showing video" });
  }
});

// Route to delete a showing video by ID
router.delete("/showingVideo/delete/:id", async (req, res) => {
  const showingVideoId = req.params.id;
  try {
    const rows = await queryDatabase("SELECT * FROM showingVideos WHERE id = ?", [showingVideoId]);
    if (rows.length === 0) {
      return res.status(404).json({ status: "not found", message: "Showing video not found" });
    }

    const showingVideo = rows[0];
    const filePath = `public/showingVideos/${showingVideo.showingVideo}`;

    // Delete the file from the server
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ status: "error", message: "Error deleting file" });
      }

      // Delete the video entry from the database
      const deleteQuery = "DELETE FROM showingVideos WHERE id = ?";
      await queryDatabase(deleteQuery, [showingVideoId]);

      res.status(200).json({ status: "success", message: "Showing video deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting showing video:", error);
    res.status(500).json({ status: "error", message: "Error deleting showing video" });
  }
});

module.exports = router;
