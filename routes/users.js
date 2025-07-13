
const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Set up middlewares
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  key: "userId",
  secret: "zubayer",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 60 * 60 * 24,
  }
}));

// Function for error handling
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

// Route to get all users
router.get('/allUsers', async (req, res) => {
  const query = 'SELECT * FROM users';
  try {
    const results = await executeQuery(query, []);
    res.json(results.length > 0 ? results : []);
  } catch (err) {
    handleError(res, 'Error retrieving users', err);
  }
});

router.get('/admin/info', async (req, res) => {
  try {
    const query = 'SELECT * FROM adminInfo WHERE id = ?';
    const result = await executeQuery(query, [1]);

    if (result.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'Admin info not found.',
        result: null
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Admin info fetched successfully.',
      result: result[0]
    });
  } catch (error) {
    console.error('Error fetching admin info:', error);
    res.status(500).json({
      code: 500,
      message: 'An error occurred while fetching admin info.',
      result: null
    });
  }
});

router.put('/admin/info/update', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 400,
      message: 'Both email and password are required.',
      result: null
    });
  }

  try {
    const query = `
      UPDATE adminInfo 
      SET email = ?, password = ?
      WHERE id = ?
    `;
    const result = await executeQuery(query, [email, password, 1]);

    res.status(200).json({
      code: 200,
      message: 'Admin email and password updated successfully.',
      result
    });
  } catch (error) {
    console.error('Error updating admin info:', error);
    res.status(500).json({
      code: 500,
      message: 'An error occurred while updating admin info.',
      result: null
    });
  }
});


// Route to get a user by email
router.get('/users', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  try {
    const results = await executeQuery(query, [email]);
    res.json(results.length > 0 ? results : []);
  } catch (err) {
    handleError(res, 'Error retrieving user by email', err);
  }
});

// Route to add a user
router.post('/users/add', async (req, res) => {
  const { name, image, phone, country, language, email, password, designation } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO users (name, image, phone, country, language, email, password, designation) VALUES (?,?,?,?,?,?,?,?)";
    const result = await executeQuery(sql, [name, image, phone, country, language, email, hash, designation]);
    res.json(result);
  } catch (err) {
    handleError(res, 'Error adding user', err);
  }
});

// Route for login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email=?";

  try {
    const result = await executeQuery(query, [email]);
    if (result.length > 0) {
      const isPasswordValid = await bcrypt.compare(password, result[0]?.password);
      if (isPasswordValid) {
        res.send(result);
      } else {
        res.send({ message: "Wrong email/password combination!" });
      }
    } else {
      res.send({ message: "User doesn't exist" });
    }
  } catch (err) {
    handleError(res, 'Error during login', err);
  }
});

// Route to check if user exists by email
router.post('/check-user', async (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  try {
    const results = await executeQuery(sql, [email]);
    res.json({ exists: results.length > 0 });
  } catch (err) {
    handleError(res, 'Error checking user existence', err);
  }
});

// Route to update user info by id
router.put('/users/update/:id', async (req, res) => {
  const { name, phone, designation, language, country } = req.body;
  const sql = `UPDATE users SET name=?, phone=?, designation=?, language=?, country=? WHERE id=?`;

  try {
    const result = await executeQuery(sql, [name, phone, designation, language, country, req.params.id]);
    res.json(result);
  } catch (err) {
    handleError(res, 'Error updating user information', err);
  }
});

// Route to update user's admin status by id
router.put('/users/update/admin/:id', async (req, res) => {
  const isAdmin = true;
  const sql = `UPDATE users SET isAdmin=? WHERE id=?`;

  try {
    const result = await executeQuery(sql, [isAdmin, req.params.id]);
    res.json(result);
  } catch (err) {
    handleError(res, 'Error updating admin status', err);
  }
});

// Route to delete a user by id
router.delete('/users/delete/:id', async (req, res) => {
  const sql = `DELETE FROM users WHERE id=?`;

  try {
    const result = await executeQuery(sql, [req.params.id]);
    res.json(result);
  } catch (err) {
    handleError(res, 'Error deleting user', err);
  }
});

module.exports = router;

