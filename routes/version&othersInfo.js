//Require necessary packages

const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');


const app = express();
app.use(cors());



//create get request to get Shopify all mark link information
router.get('/version', (req, res) => {

    connection.query('SELECT * FROM versionInfo', (error, results) => {
        if (error) {
            console.error('Error retrieving version Info', error);
            res.status(500).send('Error retrieving version Info');
        } else {
            res.json(results);
        }
    });

});


//create post request to create Shopify all mark link information

router.post('/version/add', (req, res) => {
    const { appVersion, releaseNotes, downloadUrl } = req.body;

    const dataToStore = {
        appVersion,
        releaseNotes,
        downloadUrl
    };

    let sql = `INSERT INTO versionInfo (appVersion, releaseNotes, downloadUrl) VALUES (?,?,?)`;

    connection.query(sql, [dataToStore.appVersion, dataToStore.releaseNotes, dataToStore.downloadUrl], function (err, result) {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).json({ error: "An error occurred while inserting data." });
        } else {
            console.log("Successfully inserted data", result);
            res.json(result);
        }
    });
});


// //create post request to create Shopify all mark link information
router.put('/version/update/:id', (req, res) => {
    const { id } = req.params;
    const { appVersion, releaseNotes, downloadUrl } = req.body;

    const dataToUpdate = {
        appVersion,
        releaseNotes,
        downloadUrl
    };

    const sql = `UPDATE versionInfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ? WHERE id = ?`;

    connection.query(sql, [dataToUpdate.appVersion, dataToUpdate.releaseNotes, dataToUpdate.downloadUrl, id], function (err, result) {
        if (err) {
            console.error("Error updating data:", err);
            res.status(500).json({ error: "An error occurred while updating data." });
        } else {
            console.log("Successfully updated data", result);
            res.json(result);
        }
    });
});



module.exports = router;