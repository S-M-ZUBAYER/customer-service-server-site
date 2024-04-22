//Require necessary packages

const express = require("express")
const connection = require("../config/db")
const router = express.Router()
const cors = require("cors");
const fs = require('fs');

const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
// import multer from "multer" to upload file in backend
const multer = require("multer") 

// import path from "path" to get the specific path of any file
const path = require("path");
const { route } = require("./users");



// Set the specific folder to show the file
router.use(express.static('public'))


//create the structure to upload the file with specific name

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/showingVideos')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})


//declare the multer

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Adjust the limit to handle up to 70MB
});
  



router.post('/showingVideo/add', upload.single('showingVideo'), (req, res) => {
    const { title,country } = req.body;
  
    // Check if there is an uploaded file
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No showing video uploaded' });
    }
  
    // Extract the uploaded file
    const showingVideo = req.file;
  
    // Construct the data to be inserted into the database
    const showingVideoData = {
      country,
      title,
      showingVideo: showingVideo ? showingVideo.filename : null,
    };
  
    // Insert the data into the database
    connection.query(
      'INSERT INTO showingVideos (title,countryName, showingVideo, imgPath) VALUES (?, ?, ?, ?)',
      [
        title,
        country,
        showingVideo.filename,
        'https://grozziieget.zjweiting.com:8033/tht/showingVideos/',
      ],
      (error, results) => {
        if (error) {
          console.error('Error creating showing video:', error);
          res.status(500).json({ status: 'error', message: 'Error creating showing video' });
        } else {
          console.log('showing video created successfully');
          res.status(200).json({ status: 'success', message: 'showing video created successfully' });
        }
      }
    );
  });
  

// Add a new route handler for GET requests to get all showing videos
router.get('/showingVideo', (req, res) => {
    // Query the database to retrieve all showing videos
    connection.query(
      'SELECT * FROM showingVideos', // Remove the WHERE clause
      (error, results) => {
        if (error) {
          console.error('Error retrieving showing videos:', error);
          res.status(500).json({ status: 'error', message: 'Error retrieving showing videos' });
        } else {
          // Check if any showing videos were found
          if (results.length === 0) {
            res.status(404).json({ status: 'not found', message: 'No showing videos found' });
          } else {
            res.status(200).json({ status: 'success', data: results });
          }
        }
      }
    );
  });

  router.get('/showingVideo/:country', (req, res) => {
    const { country } = req.params;
  
    // Query the database to retrieve color images based on the model number
    connection.query(
        'SELECT * FROM showingVideos WHERE countryName = ?',
        [country],
        (error, results) => {
            if (error) {
                console.error('Error retrieving showing video:', error);
                res.status(500).json({ status: 'error', message: 'Error retrieving showing video' });
            } else {
                // Check if any color images were found
                if (results.length === 0) {
                    res.status(404).json({ status: 'not found', message: 'showing video not found for the given model number' });
                } else {
                    res.status(200).json({ status: 'success', data: results });
                }
            }
        }
    );
  });
  

  
 
  router.delete('/showingVideo/delete/:id', (req, res) => {
    const showingVideoId = req.params.id;
    console.log(showingVideoId)
    // Query the database to retrieve the showing video based on its ID
    const sql = 'SELECT * FROM showingVideos WHERE id = ?';
    connection.query(sql, [showingVideoId], (error, rows) => {
        if (error) {
            console.error('Error retrieving showing video:', error);
            return res.status(500).json({ status: 'error', message: 'Error retrieving showing video' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ status: 'not found', message: 'Showing video not found' });
        }

        const showingVideo = rows[0];

        // Construct the file path to delete the video from the server
        const filePath = `public/showingVideos/${showingVideo.showingVideo}`;

        // Delete the file from the server
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ status: 'error', message: 'Error deleting file' });
            }

            // Delete the showing video entry from the database
            const deleteSql = 'DELETE FROM showingVideos WHERE id = ?';
            connection.query(deleteSql, [showingVideoId], (dbError, result) => {
                if (dbError) {
                    console.error('Error deleting showing video from database:', dbError);
                    return res.status(500).json({ status: 'error', message: 'Error deleting showing video from database' });
                }

                console.log('Showing video deleted successfully');
                return res.status(200).json({ status: 'success', message: 'Showing video deleted successfully' });
            });
        });
    });
});

  




module.exports = router;