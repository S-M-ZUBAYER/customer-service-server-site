// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');

// const app = express();
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   method: ["GET", "POST"],
//   credentials: true
// }));

// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));


// app.use(session({
//   key: "userId",
//   secret: "zubayer",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: 60 * 60 * 24,
//   }
// }))


// router.get('/allUsers', (req, res) => {
//   const query = 'SELECT * FROM users';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error retrieving users:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving users' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// router.get('/users', (req, res) => {
//   const { email } = req.query;
//   if (!email) {
//     return res.status(400).json({ error: 'Email parameter is required' });
//   }
//   const query = 'SELECT * FROM users WHERE email = ?';
//   connection.query(query, [email], (error, results) => {
//     if (error) {
//       console.error('Error retrieving users:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving users' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and function to add user in database at the time to register their new account
// router.post('/users/add', (req, res) => {
//   name = req.body.name,
//     image = req.body.image,
//     phone = req.body.phone,
//     country = req.body.country,
//     language = req.body.language,
//     email = req.body.email,
//     password = req.body.password,
//     designation = req.body.designation

//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       console.error(err)
//     }
//     else {
//       let sql = "INSERT INTO users (name, image, phone, country, language, email,password, designation) VALUES (?,?,?,?,?,?,?,?)";
//       connection.query(sql, [name, image, phone, country, language, email, hash, designation], (err, result) => {
//         if (err) throw err;
//         console.log("successfully inserted");
//         res.json(result);
//       })
//     }
//   })
// });


// router.post('/login', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   connection.query(
//     "SELECT * FROM users WHERE email=?",
//     [email],
//     (err, result) => {
//       if (err) {
//         res.send({ err: err });
//       }
//       if (result.length > 0) {
//         bcrypt.compare(password, result[0]?.password, (err, response) => {
//           if (response) {
//             res.send(result);
//           } else {
//             res.send({ message: "Wrong email/password combination!" });
//           }
//         });
//       } else {
//         res.send({ message: "User doesn't exist" });
//       }
//     }
//   );
// });


// router.post('/check-user', (req, res) => {
//   const email = req.body.email;
//   const sql = 'SELECT * FROM users WHERE email = ?';
//   connection.query(sql, [email], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).json({ error: 'Failed to execute query' });
//     } else {
//       if (results.length > 0) {
//         res.json({ exists: true });
//       } else {
//         res.json({ exists: false });
//       }
//     }
//   });
// });


// //create the route and function to update a specific user information according to the email address
// router.put('/users/update/:id', (req, res) => {
//   const { name, phone, designation, language, country } = req.body;
//   let sql = `UPDATE users SET name='${name}', phone='${phone}', designation='${designation}', language='${language}', country='${country}' WHERE id=?`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("successfully updated", result);
//     res.json(result);;
//   });
// });


// //create the route and function to update a specific user's admin information according to the email address
// router.put('/users/update/admin/:id', (req, res) => {
//   const isAdmin = true;
//   console.log(isAdmin)
//   let sql = `UPDATE users SET isAdmin='${true}' WHERE id=?`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("successfully updated", result);
//     res.json(result);;
//   });
// });


// //create the route and function to delete a specific user information according to the email address
// router.delete('/users/delete/:id', (req, res) => {
//   const sql = `DELETE FROM users WHERE id=?`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("successfully Delete", result);
//     res.json(result);
//   });
// });


// module.exports = router;


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

