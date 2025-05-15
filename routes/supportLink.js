// supportLink.routes.js

const express = require('express');
const router = express.Router();
const connection = require("../config/db");
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


// === GET all support links ===
router.get('/supportLink', async (req, res) => {
    const query = 'SELECT * FROM supportLink';
    try {
        const results = await executeQuery(query, []);
        res.status(200).json({ code: 200, message: 'Success', result: results });
    } catch (err) {
        handleError(res, 'Error retrieving support links', err);
    }
});


// === GET a support link by countryCode ===
router.get('/supportLink/:countryCode', async (req, res) => {
    const { countryCode } = req.params;
    const query = 'SELECT * FROM supportLink WHERE countryCode = ?';
    try {
        const results = await executeQuery(query, [countryCode]);
        if (results.length > 0) {
            res.status(200).json({ code: 200, message: 'Found', result: results[0] });
        } else {
            res.status(404).json({ code: 404, message: 'Not found', result: null });
        }
    } catch (err) {
        handleError(res, 'Error retrieving by country code', err);
    }
});


// === POST a new support link ===
router.post('/supportLink/create', async (req, res) => {
    const { countryCode, getStartedLink, businessCooperationLink, helpCenterLink, feedbackLink } = req.body;
    const query = `
      INSERT INTO supportLink (countryCode, getStartedLink, businessCooperationLink, helpCenterLink, feedbackLink)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
        await executeQuery(query, [countryCode, getStartedLink, businessCooperationLink, helpCenterLink, feedbackLink]);
        res.status(201).json({ code: 201, message: 'Support link created successfully', result: null });
    } catch (err) {
        handleError(res, 'Error creating support link', err);
    }
});


// === PUT (update) a support link by countryCode ===
router.put('/supportLink/update/:countryCode', async (req, res) => {
    const { countryCode } = req.params;
    const { getStartedLink, businessCooperationLink, helpCenterLink, feedbackLink } = req.body;
    const query = `
      UPDATE supportLink SET 
        getStartedLink = ?, 
        businessCooperationLink = ?, 
        helpCenterLink = ?, 
        feedbackLink = ? 
      WHERE countryCode = ?
    `;
    try {
        const result = await executeQuery(query, [getStartedLink, businessCooperationLink, helpCenterLink, feedbackLink, countryCode]);
        res.status(200).json({ code: 200, message: 'Support link updated successfully', result: result });
    } catch (err) {
        handleError(res, 'Error updating support link', err);
    }
});


// === DELETE a support link by countryCode ===
router.delete('/supportLink/delete/:countryCode', async (req, res) => {
    const { countryCode } = req.params;
    const query = 'DELETE FROM supportLink WHERE countryCode = ?';
    try {
        await executeQuery(query, [countryCode]);
        res.status(200).json({ code: 200, message: 'Support link deleted successfully', result: null });
    } catch (err) {
        handleError(res, 'Error deleting support link', err);
    }
});


module.exports = router;
