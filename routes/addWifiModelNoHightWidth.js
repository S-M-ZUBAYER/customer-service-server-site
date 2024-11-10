
const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const path = require("path");
const fs = require('fs');
const { log } = require("console");

const app = express();
app.use(cors());




//create the route and function to load all the categories name

router.get('/allWifiModelList', (req, res) => {

    const query = `SELECT * FROM allwifimodelnolist WHERE 1`;

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

router.get('/wifiModelList/:modelNo', (req, res) => {
    const modelNo = req.params.modelNo; // Correctly access the categoryName parameter
    const query = 'SELECT * FROM allWifiModelHightWidthList WHERE modelNo = ?';

    connection.query(query, [modelNo], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results);
        }
    });
});


// router.get('/allWifiModelInfo', (req, res) => {

//     const query = `SELECT * FROM allWifiModelHightWidthList WHERE 1`;

//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             res.status(500).json({ error: 'An error occurred' });
//         } else {
//             res.json(results);
//         }
//     });
// });
router.get('/allWifiModelInfo', (req, res) => {
    const query = `SELECT * FROM allWifiModelHightWidthList WHERE 1`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            incrementWifiApiCallCount(() => res.json(results)); // Call increment function for WiFi count
        }
    });
});

// This function increments the WiFi count
// This function increments the WiFi count
const incrementWifiApiCallCount = (callback) => {
    const updateQuery = 'UPDATE api_call_count SET wifiCount = wifiCount + 1, wifiTotalCount = wifiTotalCount + 1 WHERE id = 1';
    connection.query(updateQuery, (error) => {
        if (error) {
            console.error('Error updating WiFi call count:', error);
        }
        if (callback) callback();
    });
};


// Function to reset the wifi count
const resetWifiCount = () => {
    const resetQuery = 'UPDATE api_call_count SET wifiCount = 0 WHERE id = 1';
    connection.query(resetQuery, (error) => {
        if (error) {
            console.error('Error resetting WiFi call count:', error);
        } else {
            console.log('WiFi call count reset to 0.');
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
        resetWifiCount(); // Reset wifi count
        setInterval(() => {
            resetWifiCount(); // Reset every 24 hours
        }, 24 * 60 * 60 * 1000); // 24 hours
    }, delay);
};

// Schedule the daily reset
scheduleDailyReset();


// GET request to fetch the current api_call_count
router.get('/apiCallCount', (req, res) => {
    const query = 'SELECT * FROM api_call_count WHERE id = 1';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(results[0]); // Send back the count data
        }
    });
});


router.post('/wifiModelNo/add', (req, res) => {
    const { modelNo } = req.body;

    const sql = 'INSERT INTO allwifimodelnolist (modelNo) VALUES (?)';

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


router.post('/wifiModelHightWidth/add', (req, res) => {


    const { PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark } = req.body;

    // SQL query with placeholders for a single row
    const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue,sliderImageMark) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";

    connection.query(sql, [PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ message: "error" });
        }
        return res.json({ status: "success" });
    });
});

router.put('/wifiModelHightWidth/update', (req, res) => {
    const { id, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue } = req.body;

    // Validate if id is provided
    if (!id) {
        return res.status(400).json({ message: "id is required" });
    }

    console.log(id, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue);

    // SQL query to update the row based on id
    const sql = `
        UPDATE allWifiModelHightWidthList 
        SET defaultHeight = ?, defaultWidth = ?, maxHeight = ?, maxWidth = ?, type = ?, musicValue = ?
        WHERE id = ?
    `;

    connection.query(sql, [defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating data" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No record found to update" });
        }
        return res.status(200).json({ status: "success", message: "Data updated successfully" });
    });
});



router.post('/wifiModelHightWidth/add', (req, res) => {
    const { PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue } = req.body;

    // Input validation
    if (!PID || !modelNo || !defaultHight || !defaultWidth || !maxHight || !maxWidth || !type || !musicValue) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Create an array of arrays to represent the values to be inserted
    const values = [[PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue]];

    // SQL query with placeholders for multiple rows
    const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue) VALUES ?";

    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "An error occurred while inserting data." });
        }
        return res.status(200).json({ status: "success" });
    });
});




//create the route and function to delete specific icon according to the id

router.delete('/wifiModelInfo/delete/:id', (req, res) => {

    const sql = `DELETE FROM allwifimodelnolist WHERE id=?`;
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
    });



});

//create the route and function to delete specific icon according to the id

router.delete('/wifiModelList/delete/:id', (req, res) => {

    const sql = `DELETE FROM allWifiModelHightWidthList WHERE id=?`;
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        console.log("successfully Delete", result);
        res.json(result);
    });



});





module.exports = router;