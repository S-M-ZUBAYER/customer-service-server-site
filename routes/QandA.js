// const express = require("express");
// const connection = require("../config/db");
// const router = express.Router();
// const cors = require('cors');

// const app = express();
// app.use(cors());


// router.get('/QandAnswers', (req, res) => {
//   const { email } = req.query;
//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }
//   const query = 'SELECT * FROM questionanswers WHERE email = ?';
//   connection.query(query, [email], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving the data' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });

// //create the route and function to add new Question answer according to email address

// router.post('/QandAnswers/add', (req, res) => {
//   const QandA = [
//     req.body.email,
//     req.body.question,
//     req.body.answer,
//     req.body.date,
//     req.body.time
//   ]
//   let sql = "INSERT INTO questionanswers (email,question, answer,date,time) VALUES (?)";
//   connection.query(sql, [QandA], (err, result) => {
//     if (err) throw err;
//     console.log("successfully inserted");
//     res.json(result);
//   })

// });


// //create the route and function to update Question answer according to email address

// router.put('/QandAnswers/update/:id', (req, res) => {
//   const { email, question, answer, date, time } = req.body;

//   let sql = `UPDATE questionanswers SET email='${email}', question='${question}', answer='${answer}',date='${date}', time='${time}' WHERE id=?`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("successfully updated", result);
//     res.json(result);;
//   });
// });


// //create the route and make api to update about, date, time

// router.put('/about/update', (req, res) => {
//   const { about, date, time } = req.body;
//   let sql = `UPDATE about SET about='${about}',date='${date}', time='${time}' WHERE id=1`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("About information successfully updated", result);
//     res.json(result);;
//   });

// });


// router.get('/about', (req, res) => {
//   const query = 'SELECT * FROM about WHERE id = 1';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error retrieving about information:', error);
//       return res.status(500).json({ error: 'Error retrieving about information' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });



// //create the route and make api to update about, date, time

// router.put('/helpCenter/update', (req, res) => {
//   const { helpCenter, date, time } = req.body;
//   let sql = `UPDATE helpCenter SET helpCenter='${helpCenter}',date='${date}', time='${time}' WHERE id=1`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("Help Center information successfully updated", result);
//     res.json(result);;
//   });

// });


// router.get('/helpCenter', (req, res) => {
//   const query = 'SELECT * FROM helpCenter WHERE id = 1';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error retrieving help center data:', error);
//       return res.status(500).json({ error: 'Error retrieving help center data' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and make api to Help Center about, date, time

// router.put('/businessCooperation/update', (req, res) => {
//   const { businessCooperation, date, time } = req.body;
//   let sql = `UPDATE businessCooperation SET businessCooperation='${businessCooperation}',date='${date}', time='${time}' WHERE id=1`;
//   connection.query(sql, [req.params.id], function (err, result) {
//     if (err) throw err;
//     console.log("Business Cooperation information successfully updated", result);
//     res.json(result);;
//   });
// });

// router.get('/businessCooperation', (req, res) => {
//   const { id } = req.params;
//   const query = 'SELECT * FROM businessCooperation WHERE id = 1';
//   connection.query(query, [id], (error, results) => {
//     if (error) {
//       console.error('Error retrieving business cooperation data:', error);
//       return res.status(500).json({ error: 'Error retrieving business cooperation data' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and function to add delete specific Question answer according to the id

// router.delete('/QandAnswers/delete/:id', (req, res) => {
//   const sql = `DELETE FROM questionanswers WHERE id=?`;
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

// Initialize app and use cors
const app = express();
app.use(cors());

// Utility function for error handling
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ error: message });
};



// Get Question & Answers by email
router.get('/QandAnswers', async (req, res) => {
  const { email } = req.query;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const query = 'SELECT * FROM questionanswers WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) return handleError(res, error, 'Error retrieving question answers');
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while retrieving the data');
  }
});

// Add new Question & Answer
router.post('/QandAnswers/add', async (req, res) => {
  const { email, question, answer, date, time } = req.body;

  // Validate required fields
  if (!email || !question || !answer || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const QandA = [email, question, answer, date, time];

  try {
    const sql = "INSERT INTO questionanswers (email, question, answer, date, time) VALUES (?)";
    connection.query(sql, [QandA], (err, result) => {
      if (err) return handleError(res, err, 'Error inserting question answer');
      console.log("Successfully inserted");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while adding the question answer');
  }
});

// Update Question & Answer by ID
router.put('/QandAnswers/update/:id', async (req, res) => {
  const { email, question, answer, date, time } = req.body;
  const id = req.params.id;

  // Validate required fields
  if (!email || !question || !answer || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const sql = `UPDATE questionanswers SET email=?, question=?, answer=?, date=?, time=? WHERE id=?`;
    connection.query(sql, [email, question, answer, date, time, id], (err, result) => {
      if (err) return handleError(res, err, 'Error updating question answer');
      console.log("Successfully updated", result);
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the question answer');
  }
});

// Update 'About' information
router.put('/about/update', async (req, res) => {
  const { about, date, time } = req.body;

  // Validate required fields
  if (!about || !date || !time) {
    return res.status(400).json({ error: 'About, date, and time are required' });
  }

  try {
    const sql = `UPDATE about SET about=?, date=?, time=? WHERE id=1`;
    connection.query(sql, [about, date, time], (err, result) => {
      if (err) return handleError(res, err, 'Error updating about information');
      console.log("About information successfully updated");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while updating about information');
  }
});

// Get 'About' information
router.get('/about', async (req, res) => {
  try {
    const query = 'SELECT * FROM about WHERE id = 1';
    connection.query(query, (error, results) => {
      if (error) return handleError(res, error, 'Error retrieving about information');
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while retrieving about information');
  }
});

// Update 'Help Center' information
router.put('/helpCenter/update', async (req, res) => {
  const { helpCenter, date, time } = req.body;

  // Validate required fields
  if (!helpCenter || !date || !time) {
    return res.status(400).json({ error: 'Help Center, date, and time are required' });
  }

  try {
    const sql = `UPDATE helpCenter SET helpCenter=?, date=?, time=? WHERE id=1`;
    connection.query(sql, [helpCenter, date, time], (err, result) => {
      if (err) return handleError(res, err, 'Error updating help center information');
      console.log("Help Center information successfully updated");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while updating help center information');
  }
});

// Get 'Help Center' information
router.get('/helpCenter', async (req, res) => {
  try {
    const query = 'SELECT * FROM helpCenter WHERE id = 1';
    connection.query(query, (error, results) => {
      if (error) return handleError(res, error, 'Error retrieving help center data');
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while retrieving help center data');
  }
});

// Update 'Business Cooperation' information
router.put('/businessCooperation/update', async (req, res) => {
  const { businessCooperation, date, time } = req.body;

  // Validate required fields
  if (!businessCooperation || !date || !time) {
    return res.status(400).json({ error: 'Business Cooperation, date, and time are required' });
  }

  try {
    const sql = `UPDATE businessCooperation SET businessCooperation=?, date=?, time=? WHERE id=1`;
    connection.query(sql, [businessCooperation, date, time], (err, result) => {
      if (err) return handleError(res, err, 'Error updating business cooperation information');
      console.log("Business Cooperation information successfully updated");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while updating business cooperation information');
  }
});

// Get 'Business Cooperation' information
router.get('/businessCooperation', async (req, res) => {
  try {
    const query = 'SELECT * FROM businessCooperation WHERE id = 1';
    connection.query(query, (error, results) => {
      if (error) return handleError(res, error, 'Error retrieving business cooperation data');
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while retrieving business cooperation data');
  }
});

// Delete Question & Answer by ID
router.delete('/QandAnswers/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `DELETE FROM questionanswers WHERE id=?`;
    connection.query(sql, [id], (err, result) => {
      if (err) return handleError(res, err, 'Error deleting question answer');
      console.log("Successfully deleted");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, 'An error occurred while deleting the question answer');
  }
});

module.exports = router;
