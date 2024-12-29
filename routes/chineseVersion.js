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
    const query = 'SELECT * FROM chineseversioninfo';
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

    const query = 'INSERT INTO chineseversioninfo (appVersion, releaseNotes, downloadUrl, versionMark) VALUES (?,?,?,?)';
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

    const query = `UPDATE chineseversioninfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ?, versionMark = ? WHERE id = ?`;

    try {
        const result = await executeQuery(query, [appVersion, releaseNotes, downloadUrl, versionMark, id]);
        res.json(result);
    } catch (err) {
        handleError(res, 'Error updating version info', err);
    }
});



module.exports = router;