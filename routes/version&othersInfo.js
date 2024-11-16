//Require necessary packages

const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const stripe = require("stripe")(process.env.STRIPE_SECRETE)


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
    console.log(appVersion);

    const dataToStore = {
        appVersion,
        releaseNotes,
        downloadUrl,
        versionMark
    };

    let sql = `INSERT INTO versionInfo (appVersion, releaseNotes, downloadUrl) VALUES (?,?,?,?)`;

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
    const { appVersion, releaseNotes, downloadUrl, versionMark } = req.body;

    const dataToUpdate = {
        appVersion,
        releaseNotes,
        downloadUrl,
        versionMark
    };
    console.log(dataToUpdate, id);

    const sql = `UPDATE versionInfo SET appVersion = ?, releaseNotes = ?, downloadUrl = ?,versionMark=? WHERE id = ?`;

    connection.query(sql, [dataToUpdate.appVersion, dataToUpdate.releaseNotes, dataToUpdate.downloadUrl, dataToUpdate.versionMark, id], function (err, result) {
        if (err) {
            console.error("Error updating data:", err);
            res.status(500).json({ error: "An error occurred while updating data." });
        } else {
            console.log("Successfully updated data", result);
            res.json(result);
        }
    });
});

// payment API
// GET: Retrieve payment info by email
router.get('/paymentInfo/:email', (req, res) => {
    const email = req.params.email;

    connection.query('SELECT * FROM paymentInfo WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error retrieving payment info:', error);
            res.status(500).send('Error retrieving payment info');
        } else {
            if (results.length === 1) {
                res.json(results[0]); // Return the first (and only) object
            } else if (results.length === 0) {
                res.status(404).send('No payment info found for the provided email');
            } else {
                res.json(results); // Return the array if there are multiple results
            }
        }
    });
});


// POST: Add a new payment record
router.post('/paymentInfo', (req, res) => {
    const { email, paymentStatus } = req.body;

    if (!email || paymentStatus === undefined) {
        return res.status(400).send('Email and paymentStatus are required');
    }

    const query = 'INSERT INTO paymentInfo (email, paymentStatus) VALUES (?, ?)';
    connection.query(query, [email, paymentStatus], (error, results) => {
        if (error) {
            console.error('Error adding payment info:', error);
            res.status(500).send('Error adding payment info');
        } else {
            res.status(201).send('Payment info added successfully');
        }
    });
});

router.post("/create-payment-intent", async (req, res) => {
    const { amount, email } = req.body;
    console.log(amount, email);

    // Validate request data
    if (!amount || !email) {
        return res.status(400).json({ error: "Amount and email are required" });
    }

    try {
        // Create a payment intent using Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: "usd",
            receipt_email: email,
        });

        // Log the transaction in the database
        const query = "INSERT INTO paymentInfo (amount, email, paymentStatus) VALUES (?, ?, ?)";
        connection.query(query, [amount, email, true], (err, result) => {
            if (err) {
                console.error("Database error while logging transaction:", err);
                return res.status(500).json({ error: "Failed to log transaction in database" });
            }

            console.log("Transaction logged successfully:", result.insertId);
            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                message: "Payment intent created and transaction logged successfully",
            });
        });
    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(500).json({ error: "Failed to create payment intent" });
    }
});



// PUT: Update payment status by email
router.put('/paymentInfo', (req, res) => {
    const { email, paymentStatus } = req.body;

    if (!email || paymentStatus === undefined) {
        return res.status(400).send('Email and paymentStatus are required');
    }

    const query = 'UPDATE paymentInfo SET paymentStatus = ? WHERE email = ?';
    connection.query(query, [paymentStatus, email], (error, results) => {
        if (error) {
            console.error('Error updating payment info:', error);
            res.status(500).send('Error updating payment info');
        } else if (results.affectedRows === 0) {
            res.status(404).send('No record found for the provided email');
        } else {
            res.send('Payment info updated successfully');
        }
    });
});

// DELETE: Remove a payment record by ID
router.delete('/paymentInfo/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM paymentInfo WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting payment info:', error);
            res.status(500).send('Error deleting payment info');
        } else if (results.affectedRows === 0) {
            res.status(404).send('No record found with the provided ID');
        } else {
            res.send('Payment info deleted successfully');
        }
    });
});

module.exports = router;