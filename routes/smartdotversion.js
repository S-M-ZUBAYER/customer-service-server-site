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
router.get('/smartDot/allVersion', async (req, res) => {
    const query = 'SELECT * FROM smartDotVersion';
    try {
        const results = await executeQuery(query, []);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});
// Get version info
router.get('/smartDot/version/global', async (req, res) => {
    const query = 'SELECT * FROM smartDotVersion WHERE region = ?';
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
router.get('/smartDot/version/china', async (req, res) => {
    const query = 'SELECT * FROM smartDotVersion WHERE region = ?';
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
router.post('/smartDot/version/add', async (req, res) => {
    const { modelName, region, versionCategory, sliderImageMark } = req.body;

    if (!modelName || !region || !versionCategory || !sliderImageMark) {
        return res.status(400).json({
            status: 'error',
            error: 'modelName, region, sliderImageMark and versionCategory are required.'
        });
    }

    const query = `INSERT INTO smartDotVersion (modelName, region, versionCategory, sliderImageMark) VALUES (?, ?, ?, ?)`;

    try {
        const result = await executeQuery(query, [modelName, region, versionCategory, sliderImageMark]);
        res.json({
            status: 'success',
            message: 'Smart Dot Version info created successfully.',
            result
        });
    } catch (err) {
        handleError(res, 'Error inserting version info', err);
    }
});

// Update version info
router.put('/smartDot/version/update/:id', async (req, res) => {
    const { id } = req.params;
    const { modelName, region, versionCategory, sliderImageMark } = req.body;

    if (!modelName || !region || !versionCategory || !sliderImageMark) {
        return res.status(400).json({
            status: 'error',
            error: 'modelName, region,sliderImageMark and versionCategory are required.'
        });
    }

    const query = `
        UPDATE smartDotVersion 
        SET modelName = ?, region = ?, versionCategory = ?, sliderImageMark=?
        WHERE id = ?
    `;

    try {
        const result = await executeQuery(query, [modelName, region, versionCategory, sliderImageMark, id]);
        res.json({
            status: 'success',
            message: 'Smart Dot Version info updated successfully.',
            result
        });
    } catch (err) {
        handleError(res, 'Error updating version info', err);
    }
});

// Delete version info
router.delete('/smartDot/version/delete/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            error: 'Version ID is required for deletion.'
        });
    }

    const query = `DELETE FROM smartDotVersion WHERE id = ?`;

    try {
        const result = await executeQuery(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                error: 'No version info found with the given ID.'
            });
        }

        res.json({
            status: 'success',
            message: 'Smart Dot info deleted successfully.',
            result
        });
    } catch (err) {
        handleError(res, 'Error deleting version info', err);
    }
});


module.exports = router;
