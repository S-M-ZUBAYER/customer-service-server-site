// const express = require('express');
// const connection = require('../config/db'); // Ensure the path to your DB config is correct
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRETE)


// // GET: Retrieve payment info by email
// router.get('/paymentInfo/:email', (req, res) => {
//     const email = req.params.email;
//     connection.query('SELECT * FROM paymentInfo WHERE email = ?', [email], (error, results) => {
//         if (error) {
//             console.error('Error retrieving payment info:', error);
//             res.status(500).send('Error retrieving payment info');
//         } else {
//             if (results.length === 1) {
//                 res.json(results[0]);
//             } else if (results.length === 0) {
//                 res.send({
//                     email: email,
//                     paymentStatus: 0
//                 });
//             } else {
//                 res.json(results);
//             }
//         }
//     });
// });


// // POST: Add a new payment record
// router.post('/paymentInfo', (req, res) => {
//     const { email, paymentStatus } = req.body;
//     if (!email === undefined) {
//         return res.status(400).send('Email and paymentStatus are required');
//     }
//     const query = 'INSERT INTO paymentInfo (email, paymentStatus) VALUES (?, ?)';
//     connection.query(query, [email, true], (error, results) => {
//         if (error) {
//             console.error('Error adding payment info:', error);
//             res.status(500).send('Error adding payment info');
//         } else {
//             res.status(201).send('Payment info added successfully');
//         }
//     });
// });


// router.post("/create-payment-intent", async (req, res) => {
//     const { amount, email, currency } = req.body;

//     // Validate request data
//     if (!amount || !email || !currency) {
//         return res.status(400).json({ error: "Amount, email, and currency are required" });
//     }

//     try {
//         // Create a payment intent with the provided currency
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // Convert to smallest unit of currency (e.g., cents for USD)
//             currency: currency.toLowerCase(), // Ensure currency is in lowercase (e.g., "usd", "eur")
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
//                     SET amount = ?, currency = ?, paymentStatus = ?, paymentTime = ?
//                     WHERE email = ?
//                 `;
//                 connection.query(updateQuery, [amount, currency, true, paymentTime, email], (updateErr) => {
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
//                     INSERT INTO paymentInfo (amount, currency, email, paymentStatus, paymentTime) 
//                     VALUES (?, ?, ?, ?, ?)
//                 `;
//                 connection.query(insertQuery, [amount, currency, email, true, paymentTime], (insertErr, result) => {
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


// // PUT: Update payment status by email
// router.put('/paymentInfo', (req, res) => {
//     const { email, paymentStatus } = req.body;
//     if (!email || paymentStatus === undefined) {
//         return res.status(400).send('Email and paymentStatus are required');
//     }

//     const query = 'UPDATE paymentInfo SET paymentStatus = ? WHERE email = ?';
//     connection.query(query, [paymentStatus, email], (error, results) => {
//         if (error) {
//             console.error('Error updating payment info:', error);
//             res.status(500).send('Error updating payment info');
//         } else if (results.affectedRows === 0) {
//             res.status(404).send('No record found for the provided email');
//         } else {
//             res.send('Payment info updated successfully');
//         }
//     });
// });

// // DELETE: Remove a payment record by ID
// router.delete('/paymentInfo/:id', (req, res) => {
//     const id = req.params.id;
//     const query = 'DELETE FROM paymentInfo WHERE id = ?';
//     connection.query(query, [id], (error, results) => {
//         if (error) {
//             console.error('Error deleting payment info:', error);
//             res.status(500).send('Error deleting payment info');
//         } else if (results.affectedRows === 0) {
//             res.status(404).send('No record found with the provided ID');
//         } else {
//             res.send('Payment info deleted successfully');
//         }
//     });
// });


// // GET request to fetch all data
// router.get('/pdfPayment', (req, res) => {
//     connection.query('SELECT * FROM pdfPayment', (err, results) => {
//         if (err) {
//             console.error('Error fetching data:', err.message);
//             return res.status(500).json({ error: 'Failed to fetch data' });
//         }
//         res.status(200).json(results);
//     });
// });

// // GET request to fetch one element by ID
// router.get('/pdfPayment/:id', (req, res) => {
//     const { id } = req.params;
//     connection.query('SELECT * FROM pdfPayment WHERE id = ?', [id], (err, results) => {
//         if (err) {
//             console.error('Error fetching data:', err.message);
//             return res.status(500).json({ error: 'Failed to fetch data' });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'Element not found' });
//         }
//         res.status(200).json(results[0]);
//     });
// });

// // POST request to add data
// router.post('/pdfPayment', (req, res) => {
//     const { pdfAmount } = req.body;
//     if (!pdfAmount) {
//         return res.status(400).json({ error: 'pdfAmount is required' });
//     }
//     const query = 'INSERT INTO pdfPayment (pdfAmount) VALUES (?)';
//     connection.query(query, [pdfAmount], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err.message);
//             return res.status(500).json({ error: 'Failed to insert data' });
//         }
//         res.status(201).json({ id: result.insertId, pdfAmount });
//     });
// });

// // PUT request to update the first element
// router.put('/pdfPayment/update', (req, res) => {
//     const { pdfAmount } = req.body;
//     if (!pdfAmount) {
//         return res.status(400).json({ error: 'pdfAmount is required' });
//     }
//     connection.query('SELECT id FROM pdfPayment ORDER BY id ASC LIMIT 1', (err, results) => {
//         if (err) {
//             console.error('Error fetching first element:', err.message);
//             return res.status(500).json({ error: 'Failed to fetch data' });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No element to update' });
//         }
//         const firstId = results[0].id;
//         connection.query('UPDATE pdfPayment SET pdfAmount = ? WHERE id = ?', [pdfAmount, firstId], (err) => {
//             if (err) {
//                 console.error('Error updating data:', err.message);
//                 return res.status(500).json({ error: 'Failed to update data' });
//             }
//             res.status(200).json({ id: firstId, pdfAmount });
//         });
//     });
// });

// // DELETE request to remove an element by ID
// router.delete('/pdfPayment/:id', (req, res) => {
//     const { id } = req.params;
//     connection.query('DELETE FROM pdfPayment WHERE id = ?', [id], (err, result) => {
//         if (err) {
//             console.error('Error deleting data:', err.message);
//             return res.status(500).json({ error: 'Failed to delete data' });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Element not found' });
//         }
//         res.status(200).json({ message: 'Element deleted successfully' });
//     });
// });



// module.exports = router;



const express = require('express');
const connection = require('../config/db'); // Ensure the path to your DB config is correct
const pool = require('../config/db');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRETE);

// Utility function to handle errors
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Utility function to query the database
// const queryDatabase = (query, params, res, callback) => {
//     connection.query(query, params, (err, results) => {
//         if (err) {
//             handleError(res, err, 'Database query error');
//             return;
//         }
//         callback(results);
//     });
// };

const queryDatabase = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

// GET: Retrieve payment info by email
// GET: Retrieve payment info by email
router.get('/paymentInfo/:email', async (req, res) => {
    const email = req.params.email;
    const query = 'SELECT * FROM paymentInfo WHERE email = ?';

    try {
        const results = await queryDatabase(query, [email]);
        if (results.length === 1) {
            res.status(200).json(results[0]);
        } else {
            res.json({
                email: email,
                paymentStatus: 0,
            });
        }
    } catch (error) {
        console.error('Error retrieving payment info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: Retrieve crop payment info by email
router.get('/cropPaymentInfo/:email', async (req, res) => {
    const email = req.params.email;
    const query = 'SELECT * FROM cropPaymentInfo WHERE email = ?';

    try {
        const results = await queryDatabase(query, [email]);
        if (results.length === 1) {
            res.json(results[0]);
        } else {
            res.send({
                email: email,
                paymentStatus: 0
            });
        }
    } catch (error) {
        console.error('Error retrieving crop payment info:', error);
        res.status(500).send('Internal Server Error');
    }
});



// POST: Add a new pdf payment record
router.post('/pdfPaymentInfo', async (req, res) => {
    const { email, paymentStatus, amount, paymentTime, currency, purpose } = req.body;

    // Validation for required fields
    if (!email || paymentStatus === undefined || amount === undefined || !paymentTime || !currency || !purpose) {
        return res.status(400).send('Email, paymentStatus, amount, paymentTime, purpose, and currency are required');
    }

    try {
        const query = `
            INSERT INTO paymentInfo (email, paymentStatus, amount, paymentTime, currency, purpose) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await queryDatabase(query, [email, paymentStatus, amount, paymentTime, currency, purpose]);

        res.status(201).send('Pdf payment info added successfully');
    } catch (error) {
        console.error('Error adding pdf payment info:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST: Add a new crop payment record
router.post('/cropPaymentInfo', async (req, res) => {
    const { email, paymentStatus, amount, paymentTime, currency, purpose } = req.body;

    // Validation for required fields
    if (!email || paymentStatus === undefined || amount === undefined || !paymentTime || !currency || !purpose) {
        return res.status(400).send('Email, paymentStatus, amount, paymentTime, purpose, and currency are required');
    }

    try {
        const query = `
            INSERT INTO croppaymentinfo (email, paymentStatus, amount, paymentTime, currency, purpose) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await queryDatabase(query, [email, paymentStatus, amount, paymentTime, currency, purpose]);

        res.status(201).send('Crop payment info added successfully');
    } catch (error) {
        console.error('Error adding crop payment info:', error);
        res.status(500).send('Internal Server Error');
    }
});


// POST: Create pdf payment intent with Stripe
router.post("/create-pdfPayment-intent", async (req, res) => {
    const { amount, email, currency, purpose } = req.body;

    // Validate request body
    if (!amount || !email || !currency || !purpose) {
        return res.status(400).json({ error: "Amount, email, currency, and purpose are required" });
    }

    try {
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest unit
            currency: currency.toLowerCase(),
            receipt_email: email,
        });

        const paymentTime = new Date();
        const selectQuery = 'SELECT * FROM paymentInfo WHERE email = ?';

        // Check if the record exists
        const existingRecords = await queryDatabase(selectQuery, [email]);

        if (existingRecords.length > 0) {
            // Update existing record
            const updateQuery = `
                UPDATE paymentInfo 
                SET amount = ?, currency = ?, paymentStatus = ?, paymentTime = ?, purpose = ?
                WHERE email = ?
            `;
            await queryDatabase(updateQuery, [amount, currency, true, paymentTime, purpose, email]);
        } else {
            // Insert new record
            const insertQuery = `
                INSERT INTO paymentInfo (amount, currency, email, paymentStatus, paymentTime, purpose)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await queryDatabase(insertQuery, [amount, currency, email, true, paymentTime, purpose]);
        }

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            message: "Payment intent created successfully",
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST: Create crop payment intent with Stripe
router.post("/create-cropPayment-intent", async (req, res) => {
    const { amount, email, currency, purpose } = req.body;

    // Validate request body
    if (!amount || !email || !currency || !purpose) {
        return res.status(400).json({ error: "Amount, email, currency, and purpose are required" });
    }

    try {
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest unit
            currency: currency.toLowerCase(),
            receipt_email: email,
        });

        const paymentTime = new Date();
        const selectQuery = 'SELECT * FROM croppaymentinfo WHERE email = ?';

        // Check if the record exists
        const existingRecords = await queryDatabase(selectQuery, [email]);

        if (existingRecords.length > 0) {
            // Update existing record
            const updateQuery = `
                UPDATE croppaymentinfo
                SET amount = ?, currency = ?, paymentStatus = ?, paymentTime = ?, purpose = ?
                WHERE email = ?
            `;
            await queryDatabase(updateQuery, [amount, currency, true, paymentTime, purpose, email]);
        } else {
            // Insert new record
            const insertQuery = `
                INSERT INTO croppaymentinfo (amount, currency, email, paymentStatus, paymentTime, purpose)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await queryDatabase(insertQuery, [amount, currency, email, true, paymentTime, purpose]);
        }

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            message: "Payment intent created successfully",
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// PUT: Update an existing PDF payment record
router.put('/pdfPaymentInfo', async (req, res) => {
    const { email, paymentStatus, amount, paymentTime, currency, purpose } = req.body;

    // Validation for required fields
    if (!email || paymentStatus === undefined || amount === undefined || !paymentTime || !currency || !purpose) {
        return res.status(400).json({
            error: 'Email, paymentStatus, amount, paymentTime, currency, and purpose are required',
        });
    }

    try {
        const query = `
            UPDATE paymentInfo 
            SET paymentStatus = ?, amount = ?, paymentTime = ?, currency = ?, purpose = ? 
            WHERE email = ?
        `;
        const results = await queryDatabase(query, [paymentStatus, amount, paymentTime, currency, purpose, email]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No record found for the provided email' });
        }

        res.status(200).json({ message: 'Payment info updated successfully' });
    } catch (error) {
        console.error('Error updating payment info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT: Update an existing crop payment record
router.put('/cropPaymentInfo', async (req, res) => {
    const { email, paymentStatus, amount, paymentTime, currency, purpose } = req.body;

    // Validation for required fields
    if (!email || paymentStatus === undefined || amount === undefined || !paymentTime || !currency || !purpose) {
        return res.status(400).json({
            error: 'Email, paymentStatus, amount, paymentTime, currency, and purpose are required',
        });
    }

    try {
        const query = `
            UPDATE croppaymentinfo 
            SET paymentStatus = ?, amount = ?, paymentTime = ?, currency = ?, purpose = ? 
            WHERE email = ?
        `;
        const results = await queryDatabase(query, [paymentStatus, amount, paymentTime, currency, purpose, email]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No record found for the provided email' });
        }

        res.status(200).json({ message: 'Crop Payment info updated successfully' });
    } catch (error) {
        console.error('Error updating crop payment info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// DELETE: Remove a payment record by ID
router.delete('/paymentInfo/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM paymentInfo WHERE id = ?';
    queryDatabase(query, [id], res, (result) => {
        if (result.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
        }
        res.send('Payment info deleted successfully');
    });
});

// GET: Fetch all PDF payments
router.get('/pdfPayment', async (req, res) => {
    const query = 'SELECT * FROM pdfPayment';
    try {
        const results = await queryDatabase(query, []);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching PDF payment data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET: Fetch all Crop payments
router.get('/cropPayment', async (req, res) => {
    const query = 'SELECT * FROM croppayment';
    try {
        const results = await queryDatabase(query, []);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching Crop payment data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET: Fetch one PDF payment by ID
router.get('/pdfPayment/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pdfPayment WHERE id = ?';

    try {
        const results = await queryDatabase(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Element not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error('Error fetching PDF payment by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET: Fetch one Crop payment by ID
router.get('/cropPayment/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM croppayment WHERE id = ?';

    try {
        const results = await queryDatabase(query, [id]);
        if (results.length === 0) {
            return res.json({ error: 'Element not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error('Error fetching Crop payment by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});



// POST request to add data for crop payment
router.post('/pdfPayment', (req, res) => {
    const { USD, EUR, SGD, CNY } = req.body;

    // Validate input
    if ([USD, EUR, SGD, CNY].some((value) => value === undefined || value === null)) {
        return res.status(400).json({ error: 'USD, EUR, SGD, and CNY are all required' });
    }

    const query = 'INSERT INTO pdfPayment (USD, EUR, SGD, CNY) VALUES (?, ?, ?, ?)';
    queryDatabase(query, [USD, EUR, SGD, CNY], res, (result) => {
        if (!result) {
            return res.status(500).json({ error: 'Failed to add crop payment record' });
        }
        res.status(201).json({
            status: 'success',
            message: 'Crop payment record added successfully',
            data: { id: result.insertId, USD, EUR, SGD, CNY },
        });
    });
});


// POST request to add data for crop payment
router.post('/cropPayment', (req, res) => {
    const { USD, EUR, SGD, CNY } = req.body;

    // Validate input
    if ([USD, EUR, SGD, CNY].some((value) => value === undefined || value === null)) {
        return res.status(400).json({ error: 'USD, EUR, SGD, and CNY are all required' });
    }

    const query = 'INSERT INTO croppayment (USD, EUR, SGD, CNY) VALUES (?, ?, ?, ?)';
    queryDatabase(query, [USD, EUR, SGD, CNY], res, (result) => {
        if (!result) {
            return res.status(500).json({ error: 'Failed to add crop payment record' });
        }
        res.status(201).json({
            status: 'success',
            message: 'Crop payment record added successfully',
            data: { id: result.insertId, USD, EUR, SGD, CNY },
        });
    });
});


// PUT request to update an existing Pdf payment record
router.put('/pdfPayment/update', async (req, res) => {
    const { id, USD, EUR, SGD, CNY } = req.body;

    // Input validation
    if (
        !id ||
        [USD, EUR, SGD, CNY].some(value => value === undefined || value === null || isNaN(value))
    ) {
        return res.status(400).json({
            error: 'Invalid input: id, USD, EUR, SGD, and CNY are required and must be valid numbers',
        });
    }

    try {
        const query = 'UPDATE pdfPayment SET USD = ?, EUR = ?, SGD = ?, CNY = ? WHERE id = ?';
        const result = await queryDatabase(query, [USD, EUR, SGD, CNY, id]);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ error: 'No record found for the provided id' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Record updated successfully',
            data: { id, USD, EUR, SGD, CNY },
        });
    } catch (error) {
        console.error('Error during database update:', error);
        res.status(500).json({ error: 'An error occurred while updating the record' });
    }
});
// PUT request to update an existing Pdf payment record
router.put('/cropPayment/update', async (req, res) => {
    const { id, USD, EUR, SGD, CNY } = req.body;

    // Input validation
    if (
        !id ||
        [USD, EUR, SGD, CNY].some(value => value === undefined || value === null || isNaN(value))
    ) {
        return res.status(400).json({
            error: 'Invalid input: id, USD, EUR, SGD, and CNY are required and must be valid numbers',
        });
    }

    try {
        const query = 'UPDATE croppayment SET USD = ?, EUR = ?, SGD = ?, CNY = ? WHERE id = ?';
        const result = await queryDatabase(query, [USD, EUR, SGD, CNY, id]);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ error: 'No record found for the provided id' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Record updated successfully',
            data: { id, USD, EUR, SGD, CNY },
        });
    } catch (error) {
        console.error('Error during database update:', error);
        res.status(500).json({ error: 'An error occurred while updating the record' });
    }
});



// DELETE request to remove an element by ID
router.delete('/pdfPayment/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pdfPayment WHERE id = ?';
    queryDatabase(query, [id], res, (result) => {
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Element not found' });
        }
        res.status(200).json({ message: 'Element deleted successfully' });
    });
});

// DELETE request to remove an element by ID
router.delete('/cropPayment/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM croppayment WHERE id = ?';
    queryDatabase(query, [id], res, (result) => {
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Element not found' });
        }
        res.status(200).json({ message: 'Element deleted successfully' });
    });
});

module.exports = router;
