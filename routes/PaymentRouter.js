const express = require('express');
const connection = require('../config/db'); // Ensure the path to your DB config is correct
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRETE)




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
                res.send({
                    email: email,
                    paymentStatus: 0
                });
            } else {
                res.json(results); // Return the array if there are multiple results
            }
        }
    });
});


// POST: Add a new payment record
router.post('/paymentInfo', (req, res) => {
    const { email, paymentStatus } = req.body;

    if (!email === undefined) {
        return res.status(400).send('Email and paymentStatus are required');
    }

    const query = 'INSERT INTO paymentInfo (email, paymentStatus) VALUES (?, ?)';
    connection.query(query, [email, true], (error, results) => {
        if (error) {
            console.error('Error adding payment info:', error);
            res.status(500).send('Error adding payment info');
        } else {
            res.status(201).send('Payment info added successfully');
        }
    });
});



// router.post("/create-payment-intent", async (req, res) => {
//     const { amount, email } = req.body;
//     console.log(amount, email);

//     // Validate request data
//     if (!amount || !email) {
//         return res.status(400).json({ error: "Amount and email are required" });
//     }

//     try {
//         // Create a payment intent with USD as the only supported currency
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // Convert to cents
//             currency: 'usd', // Always USD
//             receipt_email: email,
//         });

//         // Get the current timestamp
//         const paymentTime = new Date();

//         // Check if the email already exists
//         const selectQuery = "SELECT * FROM paymentInfo WHERE email = ?";
//         connection.query(selectQuery, [email], (err, results) => {
//             if (err) {
//                 console.error("Database error while checking email:", err);
//                 return res.status(500).json({ error: "Database query failed" });
//             }

//             if (results.length > 0) {
//                 // Update the existing record
//                 const updateQuery = `
//                     UPDATE paymentInfo 
//                     SET amount = ?, paymentStatus = ?, paymentTime = ?
//                     WHERE email = ?
//                 `;
//                 connection.query(updateQuery, [amount, true, paymentTime, email], (updateErr) => {
//                     if (updateErr) {
//                         console.error("Database error while updating transaction:", updateErr);
//                         return res.status(500).json({ error: "Failed to update transaction in database" });
//                     }

//                     console.log("Transaction updated successfully for email:", email);
//                     return res.status(200).json({
//                         clientSecret: paymentIntent.client_secret,
//                         message: "Payment intent created and transaction updated successfully",
//                     });
//                 });
//             } else {
//                 // Insert a new record
//                 const insertQuery = `
//                     INSERT INTO paymentInfo (amount, email, paymentStatus, paymentTime) 
//                     VALUES (?, ?, ?, ?)
//                 `;
//                 connection.query(insertQuery, [amount, email, true, paymentTime], (insertErr, result) => {
//                     if (insertErr) {
//                         console.error("Database error while logging transaction:", insertErr);
//                         return res.status(500).json({ error: "Failed to log transaction in database" });
//                     }

//                     console.log("Transaction logged successfully:", result.insertId);
//                     return res.status(200).json({
//                         clientSecret: paymentIntent.client_secret,
//                         message: "Payment intent created and transaction logged successfully",
//                     });
//                 });
//             }
//         });
//     } catch (error) {
//         console.error("Stripe Payment Intent creation error:", error);
//         res.status(500).json({ error: "Internal Server Error while creating payment intent" });
//     }
// });

router.post("/create-payment-intent", async (req, res) => {
    const { amount, email, currency } = req.body; // Include currency in request body
    console.log(amount, email, currency);

    // Validate request data
    if (!amount || !email || !currency) {
        return res.status(400).json({ error: "Amount, email, and currency are required" });
    }

    try {
        // Create a payment intent with the provided currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest unit of currency (e.g., cents for USD)
            currency: currency.toLowerCase(), // Ensure currency is in lowercase (e.g., "usd", "eur")
            receipt_email: email,
        });

        // Get the current timestamp
        const paymentTime = new Date();

        // Check if the email already exists
        const selectQuery = "SELECT * FROM paymentInfo WHERE email = ?";
        connection.query(selectQuery, [email], (err, results) => {
            if (err) {
                console.error("Database error while checking email:", err);
                return res.status(500).json({ error: "Database query failed" });
            }

            if (results.length > 0) {
                // Update the existing record
                const updateQuery = `
                    UPDATE paymentInfo 
                    SET amount = ?, currency = ?, paymentStatus = ?, paymentTime = ?
                    WHERE email = ?
                `;
                connection.query(updateQuery, [amount, currency, true, paymentTime, email], (updateErr) => {
                    if (updateErr) {
                        console.error("Database error while updating transaction:", updateErr);
                        return res.status(500).json({ error: "Failed to update transaction in database" });
                    }

                    console.log("Transaction updated successfully for email:", email);
                    return res.status(200).json({
                        clientSecret: paymentIntent.client_secret,
                        message: "Payment intent created and transaction updated successfully",
                    });
                });
            } else {
                // Insert a new record
                const insertQuery = `
                    INSERT INTO paymentInfo (amount, currency, email, paymentStatus, paymentTime) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                connection.query(insertQuery, [amount, currency, email, true, paymentTime], (insertErr, result) => {
                    if (insertErr) {
                        console.error("Database error while logging transaction:", insertErr);
                        return res.status(500).json({ error: "Failed to log transaction in database" });
                    }

                    console.log("Transaction logged successfully:", result.insertId);
                    return res.status(200).json({
                        clientSecret: paymentIntent.client_secret,
                        message: "Payment intent created and transaction logged successfully",
                    });
                });
            }
        });
    } catch (error) {
        console.error("Stripe Payment Intent creation error:", error);
        res.status(500).json({ error: "Internal Server Error while creating payment intent" });
    }
});




// router.post("/process-payment", async (req, res) => {
//     console.log("payment");

//     const { cardNumber, expMonth, expYear, cvc, amount, email } = req.body;

//     if (!cardNumber || !expMonth || !expYear || !cvc || !amount || !email) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     try {
//         // Step 1: Create a Card Token (simulates frontend tokenization)
//         const token = await stripe.tokens.create({
//             card: {
//                 number: cardNumber,
//                 exp_month: expMonth,
//                 exp_year: expYear,
//                 cvc: cvc,
//             },
//         });

//         // Step 2: Create a Payment Intent with the Token
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // Convert to cents
//             currency: "usd",
//             payment_method_data: {
//                 type: "card",
//                 card: { token: token.id },
//             },
//             receipt_email: email,
//             confirm: true, // Confirm the payment immediately
//         });

//         // Step 3: Send success response
//         res.status(200).json({
//             message: "Payment successful",
//             paymentIntent: paymentIntent,
//         });
//     } catch (error) {
//         // Handle errors
//         console.error("Error processing payment:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });


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


// GET request to fetch all data
router.get('/pdfPayment', (req, res) => {
    connection.query('SELECT * FROM pdfPayment', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        res.status(200).json(results);
    });
});

// GET request to fetch one element by ID
router.get('/pdfPayment/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM pdfPayment WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Element not found' });
        }
        res.status(200).json(results[0]);
    });
});

// POST request to add data
router.post('/pdfPayment', (req, res) => {
    console.log("call");

    const { pdfAmount } = req.body;
    if (!pdfAmount) {
        return res.status(400).json({ error: 'pdfAmount is required' });
    }
    const query = 'INSERT INTO pdfPayment (pdfAmount) VALUES (?)';
    connection.query(query, [pdfAmount], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to insert data' });
        }
        res.status(201).json({ id: result.insertId, pdfAmount });
    });
});

// PUT request to update the first element
router.put('/pdfPayment/update', (req, res) => {
    const { pdfAmount } = req.body;
    if (!pdfAmount) {
        return res.status(400).json({ error: 'pdfAmount is required' });
    }
    connection.query('SELECT id FROM pdfPayment ORDER BY id ASC LIMIT 1', (err, results) => {
        if (err) {
            console.error('Error fetching first element:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No element to update' });
        }
        const firstId = results[0].id;
        connection.query('UPDATE pdfPayment SET pdfAmount = ? WHERE id = ?', [pdfAmount, firstId], (err) => {
            if (err) {
                console.error('Error updating data:', err.message);
                return res.status(500).json({ error: 'Failed to update data' });
            }
            res.status(200).json({ id: firstId, pdfAmount });
        });
    });
});

// DELETE request to remove an element by ID
router.delete('/pdfPayment/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM pdfPayment WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err.message);
            return res.status(500).json({ error: 'Failed to delete data' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Element not found' });
        }
        res.status(200).json({ message: 'Element deleted successfully' });
    });
});

module.exports = router;
