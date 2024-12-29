// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');
// const path = require("path");
// const fs = require('fs');
// const { log } = require("console");
// const app = express();
// app.use(cors());


// router.get('/allWifiModelList', (req, res) => {
//     const query = `SELECT * FROM allwifimodelnolist WHERE 1`;
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving WiFi model list.' });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });


// router.get('/wifiModelList/:modelNo', (req, res) => {
//     const modelNo = req.params.modelNo; // Access modelNo from URL parameters
//     const query = 'SELECT * FROM allWifiModelHightWidthList WHERE modelNo = ?';
//     connection.query(query, [modelNo], (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving the WiFi model data.' });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });



// router.get('/allWifiModelInfo', (req, res) => {
//     const query = `SELECT * FROM allWifiModelHightWidthList WHERE 1`;
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving WiFi model information.' });
//         }
//         incrementWifiApiCallCount(() => res.json(results.length > 0 ? results : []));
//     });
// });


// // This function increments the WiFi count
// const incrementWifiApiCallCount = (callback) => {
//     const updateQuery = 'UPDATE api_call_count SET wifiCount = wifiCount + 1, wifiTotalCount = wifiTotalCount + 1 WHERE id = 1';
//     connection.query(updateQuery, (error) => {
//         if (error) {
//             console.error('Error updating WiFi call count:', error);
//         }
//         if (callback) callback();
//     });
// };


// // Function to reset the wifi count
// const resetWifiCount = () => {
//     const resetQuery = 'UPDATE api_call_count SET wifiCount = 0 WHERE id = 1';
//     connection.query(resetQuery, (error) => {
//         if (error) {
//             console.error('Error resetting WiFi call count:', error);
//         } else {
//             console.log('WiFi call count reset to 0.');
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
//         resetWifiCount();
//         setInterval(() => {
//             resetWifiCount();
//         }, 24 * 60 * 60 * 1000);
//     }, delay);
// };

// // Schedule the daily reset
// scheduleDailyReset();


// // GET request to fetch the current api_call_count
// router.get('/apiCallCount', (req, res) => {
//     const query = 'SELECT * FROM api_call_count WHERE id = 1';
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ error: 'An error occurred while retrieving API call count.' });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No API call count record found.' });
//         }
//         res.json(results[0]);
//     });
// });


// router.post('/wifiModelNo/add', (req, res) => {
//     const { modelNo } = req.body;
//     const sql = 'INSERT INTO allwifimodelnolist (modelNo) VALUES (?)';
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


// router.post('/wifiModelHightWidth/add', (req, res) => {
//     const { PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark } = req.body;
//     const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue,sliderImageMark) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";
//     connection.query(sql, [PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.json({ message: "error" });
//         }
//         return res.json({ status: "success" });
//     });
// });


// router.put('/wifiModelHightWidth/update', (req, res) => {
//     const { id, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue } = req.body;
//     if (!id) {
//         return res.status(400).json({ message: "id is required" });
//     }
//     const sql = `
//         UPDATE allWifiModelHightWidthList 
//         SET defaultHeight = ?, defaultWidth = ?, maxHeight = ?, maxWidth = ?, type = ?, musicValue = ?
//         WHERE id = ?
//     `;
//     connection.query(sql, [defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, id], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ message: "Error updating data" });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "No record found to update" });
//         }
//         return res.status(200).json({ status: "success", message: "Data updated successfully" });
//     });
// });


// router.post('/wifiModelHightWidth/add', (req, res) => {
//     const { PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue } = req.body;
//     if (!PID || !modelNo || !defaultHight || !defaultWidth || !maxHight || !maxWidth || !type || !musicValue) {
//         return res.status(400).json({ message: "All fields are required." });
//     }
//     const values = [[PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue]];
//     const sql = "INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHight, defaultWidth, maxHight, maxWidth, type, musicValue) VALUES ?";
//     connection.query(sql, [values], (err, result) => {
//         if (err) {
//             console.error("Error inserting data:", err);
//             return res.status(500).json({ message: "An error occurred while inserting data." });
//         }
//         return res.status(200).json({ status: "success" });
//     });
// });


// //create the route and function to delete specific icon according to the id
// router.delete('/wifiModelInfo/delete/:id', (req, res) => {
//     const sql = `DELETE FROM allwifimodelnolist WHERE id=?`;
//     connection.query(sql, [req.params.id], function (err, result) {
//         if (err) throw err;
//         console.log("successfully Delete", result);
//         res.json(result);
//     });
// });


// //create the route and function to delete specific icon according to the id
// router.delete('/wifiModelList/delete/:id', (req, res) => {
//     const sql = `DELETE FROM allWifiModelHightWidthList WHERE id=?`;
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
const cors = require("cors");
const app = express();
app.use(cors());

/** Utility function to handle database queries */
const executeQuery = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

/** Route to get all WiFi models */
router.get("/allWifiModelList", async (req, res) => {
    try {
        const query = "SELECT * FROM allwifimodelnolist WHERE 1";
        const results = await executeQuery(query);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        console.error("Error retrieving WiFi model list:", error);
        res.status(500).json({ error: "An error occurred while retrieving WiFi model list." });
    }
});

/** Route to get WiFi model details by model number */
router.get("/wifiModelList/:modelNo", async (req, res) => {
    try {
        const modelNo = req.params.modelNo;
        const query = "SELECT * FROM allWifiModelHightWidthList WHERE modelNo = ?";
        const results = await executeQuery(query, [modelNo]);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        console.error("Error retrieving WiFi model data:", error);
        res.status(500).json({ error: "An error occurred while retrieving the WiFi model data." });
    }
});

/** Route to get all WiFi model info */
router.get("/allWifiModelInfo", async (req, res) => {
    try {
        const query = "SELECT * FROM allWifiModelHightWidthList WHERE 1";
        const results = await executeQuery(query);
        incrementWifiApiCallCount();
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        console.error("Error retrieving WiFi model information:", error);
        res.status(500).json({ error: "An error occurred while retrieving WiFi model information." });
    }
});

/** Function to increment WiFi API call count */
const incrementWifiApiCallCount = async () => {
    try {
        const updateQuery = "UPDATE api_call_count SET wifiCount = wifiCount + 1, wifiTotalCount = wifiTotalCount + 1 WHERE id = 1";
        await executeQuery(updateQuery);
    } catch (error) {
        console.error("Error updating WiFi call count:", error);
    }
};

/** Function to reset WiFi count */
const resetWifiCount = async () => {
    try {
        const resetQuery = "UPDATE api_call_count SET wifiCount = 0 WHERE id = 1";
        await executeQuery(resetQuery);
        console.log("WiFi call count reset to 0.");
    } catch (error) {
        console.error("Error resetting WiFi call count:", error);
    }
};

/** Schedule daily reset of WiFi count */
const scheduleDailyReset = () => {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(0, 1, 0, 0);
    if (nextReset <= now) nextReset.setDate(nextReset.getDate() + 1);

    const delay = nextReset - now;

    setTimeout(() => {
        resetWifiCount();
        setInterval(() => {
            resetWifiCount();
        }, 24 * 60 * 60 * 1000);
    }, delay);
};

scheduleDailyReset();

/** Route to get API call count */
router.get("/apiCallCount", async (req, res) => {
    try {
        const query = "SELECT * FROM api_call_count WHERE id = 1";
        const results = await executeQuery(query);
        if (results.length === 0) {
            return res.status(404).json({ error: "No API call count record found." });
        }
        res.json(results[0]);
    } catch (error) {
        console.error("Error retrieving API call count:", error);
        res.status(500).json({ error: "An error occurred while retrieving API call count." });
    }
});

/** Route to add a new WiFi model number */
router.post("/wifiModelNo/add", async (req, res) => {
    try {
        const { modelNo } = req.body;
        const sql = "INSERT INTO allwifimodelnolist (modelNo) VALUES (?)";
        await executeQuery(sql, [modelNo]);
        res.status(201).json({ message: "modelNo added successfully" });
    } catch (error) {
        console.error("Error adding modelNo to the database:", error);
        res.status(500).json({ message: "Error adding modelNo" });
    }
});

/** Route to add a new WiFi model with height and width */
router.post("/wifiModelHightWidth/add", async (req, res) => {
    try {
        const { PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark } = req.body;
        const sql = `INSERT INTO allWifiModelHightWidthList (PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await executeQuery(sql, [PID, modelNo, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, sliderImageMark]);
        res.status(201).json({ status: "success" });
    } catch (error) {
        console.error("Error adding WiFi model data:", error);
        res.status(500).json({ message: "Error adding WiFi model data" });
    }
});

/** Route to update WiFi model details */
router.put("/wifiModelHightWidth/update", async (req, res) => {
    try {
        const { id, defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue } = req.body;
        if (!id) return res.status(400).json({ message: "id is required" });

        const sql = `UPDATE allWifiModelHightWidthList SET defaultHeight = ?, defaultWidth = ?, maxHeight = ?, maxWidth = ?, type = ?, musicValue = ? WHERE id = ?`;
        const result = await executeQuery(sql, [defaultHeight, defaultWidth, maxHeight, maxWidth, type, musicValue, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "No record found to update" });

        res.status(200).json({ status: "success", message: "Data updated successfully" });
    } catch (error) {
        console.error("Error updating WiFi model data:", error);
        res.status(500).json({ message: "Error updating data" });
    }
});

/** Route to delete a WiFi model by ID */
router.delete("/wifiModelInfo/delete/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM allwifimodelnolist WHERE id = ?";
        const result = await executeQuery(sql, [req.params.id]);
        res.json(result);
    } catch (error) {
        console.error("Error deleting WiFi model:", error);
        res.status(500).json({ message: "Error deleting WiFi model" });
    }
});

/** Route to delete WiFi model details by ID */
router.delete("/wifiModelList/delete/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM allWifiModelHightWidthList WHERE id = ?";
        const result = await executeQuery(sql, [req.params.id]);
        res.json(result);
    } catch (error) {
        console.error("Error deleting WiFi model details:", error);
        res.status(500).json({ message: "Error deleting WiFi model details" });
    }
});

module.exports = router;
