const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const app = express();
app.use(cors());

router.use(express.static('public'));

// Multer storage configuration for uploading images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/adminBackgroundImgs');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

// Function to handle query execution
const executeQuery = (query, params = []) => {
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

// GET route to fetch background images by category
router.get('/adminBackgroundImgs/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const query = 'SELECT * FROM adminBackgroundImgs WHERE categoryName = ?';
    try {
        const results = await executeQuery(query, [categoryName]);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        console.error('Error retrieving background images:', error);
        res.status(500).json({ error: 'An error occurred while retrieving background images' });
    }
});

// GET route to fetch all background categories
router.get('/adminBackgroundCategories', async (req, res) => {
    const query = 'SELECT * FROM allAdminBackgroundCategories';
    try {
        const results = await executeQuery(query);
        res.json(results.length > 0 ? results : []);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'An error occurred while retrieving categories' });
    }
});


// POST route to add background images
router.post('/adminBackgroundImgs/add', upload.array("images"), async (req, res) => {
    const images = req.files.map((file) => file.filename);
    const { email, categoryName, height, width } = req.body;

    if (!email || !categoryName || !height || !width || images.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertData = images.map((image) => [image, email, categoryName, height, width]);
    const sql = 'INSERT INTO adminBackgroundImgs (image, userEmail, categoryName, height, width) VALUES ?';

    try {
        await executeQuery(sql, [insertData]);
        res.json({ status: "success" });
    } catch (error) {
        console.error('Error inserting background images:', error);
        res.status(500).json({ error: 'An error occurred while adding images' });
    }
});

// POST route to add new background category
router.post('/adminBackgroundCategories/add', async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const sql = 'INSERT INTO allAdminBackgroundCategories (allBackgroundCategoris) VALUES (?)';

    try {
        await executeQuery(sql, [categoryName]);
        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'An error occurred while adding category' });
    }
});

// DELETE route to delete background image by id
router.delete('/adminBackgroundImgs/delete/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM adminBackgroundImgs WHERE id = ?';

    try {
        const rows = await executeQuery(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = rows[0];
        const filePath = `public/adminBackgroundImgs/${image.image}`;

        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ error: 'Error deleting file from the server' });
            }

            const deleteSql = 'DELETE FROM adminBackgroundImgs WHERE id = ?';
            await executeQuery(deleteSql, [id]);

            res.json({ message: 'Image deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting background image:', error);
        res.status(500).json({ error: 'An error occurred while deleting the image' });
    }
});

module.exports = router;
