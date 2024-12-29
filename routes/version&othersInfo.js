// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');
// const app = express();
// app.use(cors());

// router.get('/version', (req, res) => {
//     connection.query('SELECT * FROM versionInfo', (error, results) => {
//         if (error) {
//             console.error('Error retrieving version info:', error);
//             return res.status(500).json({
//                 error: 'An error occurred while retrieving version info',
//             });
//         }
//         res.json(results.length > 0 ? results : []);
//     });
// });


// //create post request to create Shopify all mark link information
// router.post('/version/add', (req, res) => {
//     const { appVersion, releaseNotes, downloadUrl } = req.body;
//     const dataToStore = {
//         appVersion,
//         releaseNotes,
//         downloadUrl,
//         versionMark
//     };

//     let sql = `INSERT INTO versionInfo (appVersion, releaseNotes, downloadUrl) VALUES (?,?,?,?)`;

//     connection.query(sql, [dataToStore.appVersion, dataToStore.releaseNotes, dataToStore.downloadUrl], function (err, result) {
//         if (err) {
//             console.error("Error inserting data:", err);
//             res.status(500).json({ error: "An error occurred while inserting data." });
//         } else {
//             console.log("Successfully inserted data", result);
//             res.json(result);
//         }
//     });
// });


// //create post request to create Shopify all mark link information
// router.put('/version/update/:id', (req, res) => {
//     const { id } = req.params;
//     const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;
//     const dataToUpdate = {
//         appVersion,
//         releaseNotes,
//         downloadUrl,
//         versionMark
//     };

//     const sql = `UPDATE versionInfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ?,versionMark=? WHERE id = ?`;

//     connection.query(sql, [dataToUpdate.appVersion, dataToUpdate.releaseNotes, dataToUpdate.downloadUrl, dataToUpdate.versionMark, id], function (err, result) {
//         if (err) {
//             console.error("Error updating data:", err);
//             res.status(500).json({ error: "An error occurred while updating data." });
//         } else {
//             console.log("Successfully updated data", result);
//             res.json(result);
//         }
//     });
// });


// module.exports = router;



const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const app = express();

app.use(cors());

// Function to handle errors and respond with consistent format
const handleError = (res, message, error) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Function to execute a query and handle results or errors (returns a promise)
const executeQuery = (query, params) => {
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

// Get version info
router.get('/version', async (req, res) => {
    const query = 'SELECT * FROM versionInfo';
    try {
        const results = await executeQuery(query, []);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});

// Create version info
router.post('/version/add', async (req, res) => {
    const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;

    if (!appVersion || !releaseNotes || !downloadUrl) {
        return res.status(400).json({ error: 'appVersion, releaseNotes, and downloadUrl are required.' });
    }

    const query = 'INSERT INTO versionInfo (appVersion, releaseNotes, downloadUrl, versionMark) VALUES (?,?,?,?)';
    try {
        const result = await executeQuery(query, [appVersion, releaseNotes, downloadUrl, versionMark]);
        res.json(result);
    } catch (err) {
        handleError(res, 'Error inserting version info', err);
    }
});

// Update version info
router.put('/version/update/:id', async (req, res) => {
    const { id } = req.params;
    const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;

    if (!appVersion || !releaseNotes || !downloadUrl || !versionMark) {
        return res.status(400).json({ error: 'appVersion, releaseNotes, downloadUrl, and versionMark are required.' });
    }

    const query = `UPDATE versionInfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ?, versionMark = ? WHERE id = ?`;

    try {
        const result = await executeQuery(query, [appVersion, releaseNotes, downloadUrl, versionMark, id]);
        res.json(result);
    } catch (err) {
        handleError(res, 'Error updating version info', err);
    }
});

//chinese version 
// Get version info
router.get('/chineseVersion', async (req, res) => {
    const query = 'SELECT * FROM versionInfo';
    try {
        const results = await executeQuery(query, []);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});

// Create version info
router.post('/chineseVersion/add', async (req, res) => {
    const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;

    if (!appVersion || !releaseNotes || !downloadUrl) {
        return res.status(400).json({ error: 'appVersion, releaseNotes, and downloadUrl are required.' });
    }

    const query = 'INSERT INTO versionInfo (appVersion, releaseNotes, downloadUrl, versionMark) VALUES (?,?,?,?)';
    try {
        const result = await executeQuery(query, [appVersion, releaseNotes, downloadUrl, versionMark]);
        res.json(result);
    } catch (err) {
        handleError(res, 'Error inserting version info', err);
    }
});

// Update version info
router.put('/chineseVersion/update/:id', async (req, res) => {
    const { id } = req.params;
    const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;

    if (!appVersion || !releaseNotes || !downloadUrl || !versionMark) {
        return res.status(400).json({ error: 'appVersion, releaseNotes, downloadUrl, and versionMark are required.' });
    }

    const query = `UPDATE versionInfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ?, versionMark = ? WHERE id = ?`;

    try {
        const result = await executeQuery(query, [appVersion, releaseNotes, downloadUrl, versionMark, id]);
        res.json(result);
    } catch (err) {
        handleError(res, 'Error updating version info', err);
    }
});


module.exports = router;
