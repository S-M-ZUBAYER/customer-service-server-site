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
router.get('/attendanceMachine/allVersion', async (req, res) => {
    const query = 'SELECT * FROM attendanceMachineVersion';
    try {
        const results = await executeQuery(query, []);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});
// Get version info
router.get('/attendanceMachine/version/global', async (req, res) => {
    const query = 'SELECT * FROM attendanceMachineVersion WHERE region = ?';
    try {
        const results = await executeQuery(query, ['EN']);
        res.json({
            status: 'success',
            data: results.length > 0 ? results : []
        });
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});


// Get chinese version info
router.get('/attendanceMachine/version/china', async (req, res) => {
    const query = 'SELECT * FROM attendanceMachineVersion WHERE region = ?';
    try {
        const results = await executeQuery(query, ['ZH']);
        res.json({
            status: 'success',
            data: results.length > 0 ? results : []
        });
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});

// Create version info
router.post('/attendanceMachine/version/add', async (req, res) => {
    const { modelName, region, versionCategory } = req.body;

    if (!modelName || !region || !versionCategory) {
        return res.status(400).json({
            status: 'error',
            error: 'modelName, region, and versionCategory are required.'
        });
    }

    const query = `INSERT INTO attendanceMachineVersion (modelName, region, versionCategory) VALUES (?, ?, ?)`;

    try {
        const result = await executeQuery(query, [modelName, region, versionCategory]);
        res.json({
            status: 'success',
            message: 'Version info created successfully.',
            result
        });
    } catch (err) {
        handleError(res, 'Error inserting version info', err);
    }
});


// Update version info
router.put('/attendanceMachine/version/update/:id', async (req, res) => {
    const { id } = req.params;
    const { modelName, region, versionCategory } = req.body;

    if (!modelName || !region || !versionCategory) {
        return res.status(400).json({
            status: 'error',
            error: 'modelName, region, and versionCategory are required.'
        });
    }

    const query = `
        UPDATE attendanceMachineVersion 
        SET modelName = ?, region = ?, versionCategory = ? 
        WHERE id = ?
    `;

    try {
        const result = await executeQuery(query, [modelName, region, versionCategory, id]);
        res.json({
            status: 'success',
            message: 'Version info updated successfully.',
            result
        });
    } catch (err) {
        handleError(res, 'Error updating version info', err);
    }
});




module.exports = router;
