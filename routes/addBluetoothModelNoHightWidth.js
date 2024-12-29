
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
//     destination: (req, file, cb) => {
//         cb(null, 'public/images');
//     },
//     filename: (req, file, cb) => {
//         const timestamp = Date.now();
//         const uniqueFilename = `${timestamp}_${file.originalname}`;
//         cb(null, uniqueFilename);
//     }
// });

// const upload = multer({
//     storage: storage
// });


// router.get('/icons', (req, res) => {
//     const category = req.query.categoryName;
//     if (!category) {
//         return res.status(400).json({ error: 'categoryName query parameter is required' });
//     }
//     const query = 'SELECT * FROM icons WHERE categoryName = ?';
//     connection.query(query, [category], (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred' });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });


// router.get('/allModelInfo', (req, res) => {
//     const query = 'SELECT * FROM allHightWidthList WHERE 1';
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred' });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });


// const incrementApiCallCount = (callback) => {
//     const updateQuery = 'UPDATE api_call_count SET bluetoothCount = bluetoothCount + 1, bluetoothTotalCount = bluetoothTotalCount + 1 WHERE id = 1';
//     connection.query(updateQuery, (error) => {
//         if (error) {
//             console.error('Error updating call count:', error);
//         }
//         if (callback) callback(); 
//     });
// };

// router.get('/modelInfo/:modelNo', (req, res) => {
//     const modelNo = req.params.modelNo;
//     const query = 'SELECT * FROM allHightWidthList WHERE modelNo = ?';
//     connection.query(query, [modelNo], (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving model information.' });
//         }
//         incrementApiCallCount(() => {
//             res.json(results.length > 0 ? results : []);
//         });
//     });
// });


// // Function to reset the bluetooth count
// const resetBluetoothCount = () => {
//     const resetQuery = 'UPDATE api_call_count SET bluetoothCount = 0 WHERE id = 1';
//     connection.query(resetQuery, (error) => {
//         if (error) {
//             console.error('Error resetting bluetooth call count:', error);
//         } else {
//             console.log('Bluetooth call count reset to 0.');
//         }
//     });
// };


// // Function to calculate the time until the next reset at 12:01 AM
// const scheduleDailyReset = () => {
//     const now = new Date();
//     const nextReset = new Date();
//     nextReset.setHours(0, 1, 0, 0);
//     if (nextReset <= now) {
//         nextReset.setDate(nextReset.getDate() + 1); 
//     }
//     const delay = nextReset - now;
//     setTimeout(() => {
//         resetBluetoothCount(); 
//         setInterval(() => {
//             resetBluetoothCount(); 
//         }, 24 * 60 * 60 * 1000); 
//     }, delay);
// };

// // Schedule the daily reset
// scheduleDailyReset();


// router.get('/modelNoList', (req, res) => {
//     const query = `SELECT * FROM allModelNoList`;
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving model numbers.' });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });


// router.post('/hightWidth/add', (req, res) => {
//     const modelNo = req.body.modelNo;
//     const defaultHight = req.body.defaultHight;
//     const pidNo = req.body.pidNo;
//     const defaultWidth = req.body.defaultWidth;
//     const maxHight = req.body.maxHight;
//     const maxWidth = req.body.maxWidth;
//     const commands = req.body.command; 
//     const sliderImageMark = req.body.sliderImageMark; 
//     const values = commands.map((command) => [modelNo, pidNo, defaultHight, defaultWidth, maxHight, maxWidth, sliderImageMark, command]);
//     const sql = "INSERT INTO allHightWidthList (modelNo,pidNo, defaultHight, defaultWidth, maxHight, maxWidth,sliderImageMark, command) VALUES ?";

//     connection.query(sql, [values], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.json({ message: "error" });
//         }
//         return res.json({ status: "success" });
//     });
// });


// router.post('/modelNo/add', (req, res) => {
//     const { modelNo } = req.body;
//     const sql = 'INSERT INTO allModelNoList (modelNo) VALUES (?)';
//     connection.query(sql, [modelNo], (err, result) => {
//         if (err) {
//             console.error('Error adding modelNo to the database:', err);
//             res.status(500).json({ message: 'Error adding modelNo' });
//             return;
//         }
//         console.log('modelNo added to the database');
//         res.status(201).json({ message: 'modelNo added successfully' });
//     });
// });


// //create the route and function to delete specific icon according to the id
// router.delete('/modelInfo/delete/:id', (req, res) => {
//     const sql = `DELETE FROM allHightWidthList WHERE id=?`;
//     connection.query(sql, [req.params.id], function (err, result) {
//         if (err) throw err;
//         console.log("successfully Delete", result);
//         res.json(result);
//     });
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

// Multer Storage Configuration
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

const upload = multer({ storage: storage });

// Utility function to handle query execution and send response
const executeQuery = (query, params = [], res) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                reject({ status: 500, message: 'An error occurred during the database operation.' });
            } else {
                resolve(results);
            }
        });
    });
};

// Route to get icons by category
router.get('/icons', async (req, res) => {
    try {
        const category = req.query.categoryName;
        if (!category) {
            return res.status(400).json({ error: 'categoryName query parameter is required' });
        }

        const query = 'SELECT * FROM icons WHERE categoryName = ?';
        const results = await executeQuery(query, [category], res);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'An error occurred' });
    }
});

// Route to get all model info
router.get('/allModelInfo', async (req, res) => {
    try {
        const query = 'SELECT * FROM allHightWidthList WHERE 1';
        const results = await executeQuery(query, [], res);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'An error occurred' });
    }
});

// Increment API call count
const incrementApiCallCount = async () => {
    const updateQuery = 'UPDATE api_call_count SET bluetoothCount = bluetoothCount + 1, bluetoothTotalCount = bluetoothTotalCount + 1 WHERE id = 1';
    try {
        await executeQuery(updateQuery, []);
    } catch (error) {
        console.error('Error updating call count:', error);
    }
};

// Route to get model info by modelNo
router.get('/modelInfo/:modelNo', async (req, res) => {
    try {
        const modelNo = req.params.modelNo;
        const query = 'SELECT * FROM allHightWidthList WHERE modelNo = ?';
        const results = await executeQuery(query, [modelNo], res);
        await incrementApiCallCount();
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'An error occurred while retrieving model information.' });
    }
});

// Function to reset the bluetooth count
const resetBluetoothCount = async () => {
    const resetQuery = 'UPDATE api_call_count SET bluetoothCount = 0 WHERE id = 1';
    try {
        await executeQuery(resetQuery, []);
        console.log('Bluetooth call count reset to 0.');
    } catch (error) {
        console.error('Error resetting bluetooth call count:', error);
    }
};

// Function to schedule daily reset
const scheduleDailyReset = () => {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(0, 1, 0, 0);

    if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1);
    }

    const delay = nextReset - now;
    setTimeout(() => {
        resetBluetoothCount();
        setInterval(() => {
            resetBluetoothCount();
        }, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, delay);
};

// Schedule the daily reset
scheduleDailyReset();

// Route to get model number list
router.get('/modelNoList', async (req, res) => {
    try {
        const query = 'SELECT * FROM allModelNoList';
        const results = await executeQuery(query, [], res);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'An error occurred while retrieving model numbers.' });
    }
});

// Route to add height and width data
router.post('/hightWidth/add', async (req, res) => {
    const { modelNo, defaultHight, pidNo, defaultWidth, maxHight, maxWidth, command, sliderImageMark } = req.body;

    const values = command.map(c => [modelNo, pidNo, defaultHight, defaultWidth, maxHight, maxWidth, sliderImageMark, c]);
    const sql = "INSERT INTO allHightWidthList (modelNo, pidNo, defaultHight, defaultWidth, maxHight, maxWidth, sliderImageMark, command) VALUES ?";

    try {
        await executeQuery(sql, [values], res);
        res.json({ status: "success" });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'Error inserting data' });
    }
});

// Route to add model number
router.post('/modelNo/add', async (req, res) => {
    const { modelNo } = req.body;
    const sql = 'INSERT INTO allModelNoList (modelNo) VALUES (?)';

    try {
        await executeQuery(sql, [modelNo], res);
        res.status(201).json({ message: 'modelNo added successfully' });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'Error adding modelNo' });
    }
});

// Route to delete a model by id
router.delete('/modelInfo/delete/:id', async (req, res) => {
    const sql = 'DELETE FROM allHightWidthList WHERE id = ?';
    try {
        const result = await executeQuery(sql, [req.params.id], res);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'Error deleting model info' });
    }
});

module.exports = router;
