
// // Import necessary packages
// const express = require('express');
// const cors = require('cors');
// const pool = require('./config/db'); // Import the database connection pool
// const fs = require('fs');
// const path = require('path');

// // Initialize the Express app
// const app = express();
// const port = process.env.PORT || 2000;

// // Middleware
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON payloads
// app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

// // Test the database connection
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("Database connection error:", err.message);
//     process.exit(1); // Exit the process if the database connection fails
//   }
//   console.log("Database connected with thread ID:", connection.threadId);
//   connection.release(); // Release the connection back to the pool
// });

// // Dynamically load all routes from the `routes` folder
// const routePath = path.join(__dirname, 'routes');
// fs.readdirSync(routePath).forEach((file) => {
//   if (file.endsWith('.js')) {
//     const route = require(`./routes/${file}`);
//     app.use('/tht', route); // Attach each route to the `/tht` base path
//   }
// });

// // Health check route
// app.get('/', (req, res) => {
//   res.send({ message: "Server is running." });
// });


// // Graceful shutdown
// process.on('SIGINT', () => {
//   pool.end((err) => {
//     if (err) {
//       console.error("Error closing database pool:", err.message);
//     } else {
//       console.log("Database pool closed.");
//     }
//     process.exit(0); // Exit the process
//   });
// });



// // Request timeout
// app.use((req, res, next) => {
//   res.setTimeout(5000, () => {
//     console.log('Request has timed out.');
//     res.status(408).send('Request Timeout');
//   });
//   next();
// });



// // Health check route
// app.get('/health', (req, res) => {
//   pool.getConnection((err) => {
//     if (err) {
//       return res.status(500).json({ error: "Database connection issue" });
//     }
//     res.status(200).json({ message: "Healthy" });
//   });
// });


// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack);
//   if (err instanceof SyntaxError) {
//     return res.status(400).json({ error: "Bad Request: Invalid JSON" });
//   }
//   res.status(500).json({ error: "An unexpected error occurred." });
// });


// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



// Import necessary packages
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // Import the database connection pool
const fs = require("fs");
const path = require("path");

// Initialize the Express app
const app = express();
const port = process.env.PORT || 2000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

// Delay utility function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Reconnection logic for continuous retries
const reconnectDatabase = async () => {
  while (true) {
    try {
      const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });

      connection.release(); // Release the connection back to the pool
      console.log("Successfully reconnected to the database.");
      return; // Exit the loop once connected
    } catch (error) {
      console.error("Reconnection attempt failed. Retrying in 5 seconds...");
      await delay(5000); // Wait before retrying
    }
  }
};

// Middleware to check and reconnect to the database
const checkAndReconnectDatabase = async (req, res, next) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection lost. Attempting to reconnect...");
        reconnectDatabase()
          .then(() => next())
          .catch((reconnectError) => {
            console.error("Reconnection failed:", reconnectError.message);
            return res.status(500).json({
              error: "Unable to reconnect to the database. Please try again later.",
            });
          });
      } else {
        console.log("Database connection is active.");
        connection.release(); // Release the connection back to the pool
        next();
      }
    });
  } catch (error) {
    console.error("Unexpected error during database check:", error);
    res.status(500).json({
      error: "An unexpected error occurred while checking the database connection.",
    });
  }
};

// Use the middleware globally
app.use(checkAndReconnectDatabase);

// Dynamically load all routes from the `routes` folder
const routePath = path.join(__dirname, "routes");
fs.readdirSync(routePath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    app.use("/tht", route); // Attach each route to the `/tht` base path
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send({ message: "Server is running." });
});

app.get("/health", (req, res) => {
  pool.getConnection((err) => {
    if (err) {
      return res.status(500).json({ error: "Database connection issue" });
    }
    res.status(200).json({ message: "Healthy" });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Bad Request: Invalid JSON" });
  }
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Graceful shutdown
process.on("SIGINT", () => {
  pool.end((err) => {
    if (err) {
      console.error("Error closing database pool:", err.message);
    } else {
      console.log("Database pool closed.");
    }
    process.exit(0); // Exit the process
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
