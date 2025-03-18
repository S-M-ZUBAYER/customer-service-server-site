const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(cors());

// Function to handle errors and respond with a consistent format
const handleError = (res, message, error) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Function to execute a query and handle results or errors (returns a promise)
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

router.post('/voltageDetails', async (req, res) => {
    const { modelId, batteryPercentage, voltage } = req.body;

    const sql = `INSERT INTO voltageDetails (model_id, battery_percentage, voltage) VALUES (?, ?, ?)`;

    try {
        const result = await executeQuery(sql, [modelId, batteryPercentage, voltage]);
        res.status(201).json({ message: 'Voltage detail added successfully', id: result.insertId });
    } catch (err) {
        handleError(res, 'Error adding voltage detail', err);
    }
});

router.get('/powerBankModels', async (req, res) => {
    const sql = `SELECT id, model_number FROM powerBankModels`;

    try {
        const rows = await executeQuery(sql);
        res.status(200).json({
            message: 'Success',
            data: rows
        });
    } catch (err) {
        handleError(res, 'Error fetching power bank models', err);
    }
});


router.get('/voltageDetails', async (req, res) => {
    const sql = `
        SELECT vd.id, vd.battery_percentage, vd.voltage, pb.model_number 
        FROM voltageDetails vd
        JOIN powerBankModels pb ON vd.model_id = pb.id
    `;

    try {
        const rows = await executeQuery(sql);
        res.status(200).json({
            message: 'Success',
            data: rows
        });
    } catch (err) {
        handleError(res, 'Error fetching all voltage details', err);
    }
});

router.get('/voltageDetails/:modelNumber', async (req, res) => {
    const modelNumber = req.params.modelNumber;

    const sql = `
        SELECT vd.id, vd.battery_percentage, vd.voltage 
        FROM voltageDetails vd
        JOIN powerBankModels pb ON vd.model_id = pb.id
        WHERE pb.model_number = ?
    `;

    try {
        const rows = await executeQuery(sql, [modelNumber]);
        if (rows.length > 0) {
            res.status(200).json({
                message: 'Success',
                data: rows
            });
        } else {
            res.status(404).json({
                message: 'No voltage details found for the given model number',
                data: []
            });
        }
    } catch (err) {
        handleError(res, 'Error fetching voltage details', err);
    }
});


router.put('/voltageDetails/:id', async (req, res) => {
    const id = req.params.id;
    const { batteryPercentage, voltage } = req.body;

    const sql = `UPDATE voltageDetails SET battery_percentage = ?, voltage = ? WHERE id = ?`;

    try {
        const result = await executeQuery(sql, [batteryPercentage, voltage, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Voltage detail not found');
        }
        res.status(200).json({ message: 'Voltage detail updated successfully' });
    } catch (err) {
        handleError(res, 'Error updating voltage detail', err);
    }
});

router.delete('/voltageDetails/:id', async (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM voltageDetails WHERE id = ?`;

    try {
        const result = await executeQuery(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Voltage detail not found');
        }
        res.status(200).json({ message: 'Voltage detail deleted successfully' });
    } catch (err) {
        handleError(res, 'Error deleting voltage detail', err);
    }
});

router.post('/powerBankModels', async (req, res) => {
    const { modelNumber } = req.body;

    const sql = `INSERT INTO powerBankModels (model_number) VALUES (?)`;

    try {
        const result = await executeQuery(sql, [modelNumber]);
        res.status(201).json({ message: 'Model number added successfully', id: result.insertId });
    } catch (err) {
        handleError(res, 'Error adding model number', err);
    }
});

module.exports = router;
