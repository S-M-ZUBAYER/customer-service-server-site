const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const app = express();
const nodemailer = require("nodemailer");

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
router.get('/emailService', async (req, res) => {
    const query = 'SELECT * FROM versionInfo';
    try {
        const results = await executeQuery(query, []);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        handleError(res, 'Error retrieving version info', err);
    }
});


// Email sending function
const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // Your Gmail App Password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
    };

    return transporter.sendMail(mailOptions);
};

// API Route to send email
router.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;
    console.log({
        to, subject, message
    });


    if (!to || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await sendEmail(to, subject, message);
        res.status(200).json({ success: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});


module.exports = router;
