// const express = require("express")
// const connection = require("../config/db")
// const router = express.Router()
// const cors = require("cors");
// const app = express();
// app.use(cors())


// router.get('/questions', (req, res) => {
//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).json({ error: 'Email query parameter is required.' });
//   }
//   const query = 'SELECT * FROM questions WHERE email = ?';
//   connection.query(query, [email], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving questions.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create a route to delete all questions from database according to the user
// router.delete('/questions/delete/:email', (req, res) => {
//   const email = req.params.email;
//   const deleteSql = 'DELETE FROM questions WHERE email = ?';
//   connection.query(deleteSql, [email], (error, result) => {
//     if (error) {
//       console.error('Error deleting questions:', error);
//       res.status(500).send('Error deleting questions');
//       return;
//     }
//     console.log('Questions deleted successfully');
//     res.json(result);
//   });
// });


// //create a route to delete all unknown questions from database according to the user
// router.delete('/unknownQuestions/delete/:email', (req, res) => {
//   const email = req.params.email;
//   const deleteSql = 'DELETE FROM unknownquestions WHERE email = ?';
//   connection.query(deleteSql, [email], (error, result) => {
//     if (error) {
//       console.error('Error deleting questions:', error);
//       res.status(500).send('Error deleting questions');
//       return;
//     }
//     res.json(result);
//   });
// });


// //create a route to delete a unknown questions from database according to the user
// router.delete('/unknownQuestions/deleteById/:id', (req, res) => {
//   const id = req.params.id;
//   const deleteSql = 'DELETE FROM unknownquestions WHERE id = ?';
//   connection.query(deleteSql, [id], (error, result) => {
//     if (error) {
//       console.error('Error deleting questions:', error);
//       res.status(500).send('Error deleting questions');
//       return;
//     }
//     res.json(result);
//   });
// });


// //create a route to delete all unknown questions from database according to the user
// router.delete('/translateData/delete/:email', (req, res) => {
//   const email = req.params.email;
//   const deleteSql = 'DELETE FROM translationsquestions WHERE email = ?';
//   connection.query(deleteSql, [email], (error, result) => {
//     if (error) {
//       console.error('Error deleting questions:', error);
//       res.status(500).send('Error deleting questions');
//       return;
//     }
//     res.json(result);
//   });
// });


// //create a route to delete a unknown questions from database according to the user
// router.delete('/translationQuestions/deleteById/:id', (req, res) => {
//   const id = req.params.id;
//   const deleteSql = 'DELETE FROM translationsquestions WHERE id = ?';
//   connection.query(deleteSql, [id], (error, result) => {
//     if (error) {
//       console.error('Error deleting questions:', error);
//       res.status(500).send('Error deleting questions');
//       return;
//     }
//     res.json(result);
//   });
// });


// //create the route and function to add all the Question Answer store according to the email address
// router.post('/questions/add', (req, res) => {
//   const allQuestions = [
//     req.body.email,
//     req.body.question,
//     req.body.date,
//     req.body.time,
//   ]

//   let sql = "INSERT INTO questions (email,question,date,time) VALUES (?)";
//   connection.query(sql, [allQuestions], (err, result) => {
//     if (err) throw err;
//     console.log("successfully inserted");
//     res.json(result);
//   })
// });


// router.get('/unknownQuestions', (req, res) => {
//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).json({ error: 'Email query parameter is required.' });
//   }
//   const query = 'SELECT * FROM unknownquestions WHERE email = ?';
//   connection.query(query, [email], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving unknown questions.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and function to add all the Unknown Question Answer store according to the email address
// router.post('/unknownQuestions/add', (req, res) => {
//   const allUnknownQuestions = [
//     req.body.email,
//     req.body.question,
//     req.body.date,
//     req.body.time,
//   ]

//   let sql = "INSERT INTO unknownquestions (email,question,date,time) VALUES (?)";
//   connection.query(sql, [allUnknownQuestions], (err, result) => {
//     if (err) throw err;
//     console.log("Unknown successfully inserted");
//     res.json(result);
//   })
// });


// router.get('/translationsQuestions', (req, res) => {
//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).json({ error: 'Email query parameter is required.' });
//   }
//   const query = 'SELECT * FROM translationsquestions WHERE email = ?';
//   connection.query(query, [email], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ error: 'An error occurred while retrieving translation questions.' });
//     }
//     res.json(results.length > 0 ? results : []);
//   });
// });


// //create the route and function to add all the translation Question and translations store according to the email address
// router.post('/translationsQuestions/add', (req, res) => {
//   const allTranslationsQuestions = [
//     req.body.email,
//     req.body.question,
//     req.body.english,
//     req.body.bangla,
//     req.body.date,
//     req.body.time,
//   ]

//   let sql = "INSERT INTO translationsquestions (email,question,english,bangla,date,time) VALUES (?)";
//   connection.query(sql, [allTranslationsQuestions], (err, result) => {
//     if (err) throw err;
//     console.log("Translations questions successfully inserted");
//     res.json(result);
//   })
// });


// module.exports = router;


const express = require("express");
const connection = require("../config/db");
const router = express.Router();

// Helper function for error handling
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// Route to fetch questions by email
router.get("/questions", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required." });
  }

  try {
    const query = "SELECT * FROM questions WHERE email = ?";
    connection.query(query, [email], (error, results) => {
      if (error) return handleError(res, error, "An error occurred while retrieving questions.");
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to delete all questions by email
router.delete("/questions/delete/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const deleteSql = "DELETE FROM questions WHERE email = ?";
    connection.query(deleteSql, [email], (error, result) => {
      if (error) return handleError(res, error, "Error deleting questions.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to delete all unknown questions by email
router.delete("/unknownQuestions/delete/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const deleteSql = "DELETE FROM unknownquestions WHERE email = ?";
    connection.query(deleteSql, [email], (error, result) => {
      if (error) return handleError(res, error, "Error deleting unknown questions.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to delete an unknown question by ID
router.delete("/unknownQuestions/deleteById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteSql = "DELETE FROM unknownquestions WHERE id = ?";
    connection.query(deleteSql, [id], (error, result) => {
      if (error) return handleError(res, error, "Error deleting unknown question by ID.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to delete all translation questions by email
router.delete("/translateData/delete/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const deleteSql = "DELETE FROM translationsquestions WHERE email = ?";
    connection.query(deleteSql, [email], (error, result) => {
      if (error) return handleError(res, error, "Error deleting translation questions.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to delete a translation question by ID
router.delete("/translationQuestions/deleteById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteSql = "DELETE FROM translationsquestions WHERE id = ?";
    connection.query(deleteSql, [id], (error, result) => {
      if (error) return handleError(res, error, "Error deleting translation question by ID.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to add a new question
router.post("/questions/add", async (req, res) => {
  const { email, question, date, time } = req.body;

  try {
    const sql = "INSERT INTO questions (email, question, date, time) VALUES (?)";
    connection.query(sql, [[email, question, date, time]], (error, result) => {
      if (error) return handleError(res, error, "Error adding question.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to fetch unknown questions by email
router.get("/unknownQuestions", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required." });
  }

  try {
    const query = "SELECT * FROM unknownquestions WHERE email = ?";
    connection.query(query, [email], (error, results) => {
      if (error) return handleError(res, error, "Error retrieving unknown questions.");
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to add an unknown question
router.post("/unknownQuestions/add", async (req, res) => {
  const { email, question, date, time } = req.body;

  try {
    const sql = "INSERT INTO unknownquestions (email, question, date, time) VALUES (?)";
    connection.query(sql, [[email, question, date, time]], (error, result) => {
      if (error) return handleError(res, error, "Error adding unknown question.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to fetch translation questions by email
router.get("/translationsQuestions", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required." });
  }

  try {
    const query = "SELECT * FROM translationsquestions WHERE email = ?";
    connection.query(query, [email], (error, results) => {
      if (error) return handleError(res, error, "Error retrieving translation questions.");
      res.json(results.length > 0 ? results : []);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

// Route to add a translation question
router.post("/translationsQuestions/add", async (req, res) => {
  const { email, question, english, bangla, date, time } = req.body;

  try {
    const sql = "INSERT INTO translationsquestions (email, question, english, bangla, date, time) VALUES (?)";
    connection.query(sql, [[email, question, english, bangla, date, time]], (error, result) => {
      if (error) return handleError(res, error, "Error adding translation question.");
      res.json(result);
    });
  } catch (error) {
    handleError(res, error, "Unexpected error occurred.");
  }
});

module.exports = router;
