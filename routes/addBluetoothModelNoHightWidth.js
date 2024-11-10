
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

// router.get('/modelInfo/:modelNo', (req, res) => {
//     const modelNo = req.params.modelNo; // Correctly access the categoryName parameter
//     console.log(modelNo)
//     const query = 'SELECT * FROM allHightWidthList WHERE modelNo = ?';

//     connection.query(query, [modelNo], (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             res.status(500).json({ error: 'An error occurred' });
//         } else {
//             res.json(results);
//         }
//     });
// });

router.get('/modelInfo/:modelNo', (req, res) => {
    const modelNo = req.params.modelNo
    console.log('Model number:', modelNo);

    const query = 'SELECT * FROM allHightWidthList WHERE modelNo = ?';
    connection.query(query, [modelNo], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            incrementApiCallCount(() => res.json(results));
        }
    });
});

const incrementApiCallCount = (callback) => {
    const updateQuery = 'UPDATE api_call_count SET bluetoothCount = bluetoothCount + 1, bluetoothTotalCount = bluetoothTotalCount + 1 WHERE id = 1';
    connection.query(updateQuery, (error) => {
        if (error) {
            console.error('Error updating call count:', error);
        }
        if (callback) callback(); // Call the callback if provided
    });
};

// Function to reset the bluetooth count
const resetBluetoothCount = () => {
    const resetQuery = 'UPDATE api_call_count SET bluetoothCount = 0 WHERE id = 1';
    connection.query(resetQuery, (error) => {
        if (error) {
            console.error('Error resetting bluetooth call count:', error);
        } else {
            console.log('Bluetooth call count reset to 0.');
        }
    });
};



// Function to calculate the time until the next reset at 12:01 AM
const scheduleDailyReset = () => {
    const now = new Date();
    const nextReset = new Date();

    // Set next reset time to 12:01 AM tomorrow
    nextReset.setHours(0, 1, 0, 0); // 12:01 AM
    if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1); // Move to the next day
    }

    // Calculate the delay until the next reset
    const delay = nextReset - now;

    // Set timeout for the first reset for both counts
    setTimeout(() => {
        resetBluetoothCount(); // Reset bluetooth count
        setInterval(() => {
            resetBluetoothCount(); // Reset every 24 hours
        }, 24 * 60 * 60 * 1000); // 24 hours
    }, delay);
};

// Schedule the daily reset
scheduleDailyReset();


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
    const pidNo = req.body.pidNo;
    const defaultWidth = req.body.defaultWidth;
    const maxHight = req.body.maxHight;
    const maxWidth = req.body.maxWidth;
    const commands = req.body.command; // Assuming 'commands' is an array of command elements
    const sliderImageMark = req.body.sliderImageMark; // Assuming 'commands' is an array of command elements

    // Create an array of arrays to represent the values to be inserted
    const values = commands.map((command) => [modelNo, pidNo, defaultHight, defaultWidth, maxHight, maxWidth, sliderImageMark, command]);

    // SQL query with placeholders for multiple rows
    const sql = "INSERT INTO allHightWidthList (modelNo,pidNo, defaultHight, defaultWidth, maxHight, maxWidth,sliderImageMark, command) VALUES ?";

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