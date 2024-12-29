// //This is the part to require necessary package

// const express = require('express');
// const cors = require('cors');
// const mysql = require("mysql");

// const usersRouter = require("./routes/users");
// const questionsRouter = require("./routes/customerService");
// const mallProductsRouter = require("./routes/mallProducts");
// const eventProductsRouter = require("./routes/eventProduct");
// const allColorImgRoute = require("./routes/productColorImgs");
// const QandARouter = require("./routes/QandA");
// const iconsRouter = require("./routes/addIcons");
// const backgroundImgsRouter = require("./routes/addBackground");
// const levelsRouter = require("./routes/level");
// const showingVideoRouter = require("./routes/showingVideo");
// const warehouseAndCitiesRouter = require("./routes/addWarehouseAndCities");
// const modelNoHightWidthRouter = require("./routes/addBluetoothModelNoHightWidth");
// const wifiModelNoHightWidthRouter = require("./routes/addWifiModelNoHightWidth");
// const versionRouter = require("./routes/version&othersInfo");
// const paymentRouter = require("./routes/PaymentRouter");

// //require the config file to connect with database

// // previous code from ----
// // const connection = require("./config/db");
// //create a function to connect with database
// // connection.connect((err) => {
// //   if (err) throw err;
// //   console.log("Db is connected successfully:", connection.threadId)
// // })

// // end--------


// // New code from ----
// const pool = require('./config/db');
// // Test the connection pool
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//     return;
//   }
//   console.log("Database connected successfully with thread ID:", connection.threadId);
//   connection.release(); // Release the connection back to the pool
// });
// // new Code end--------

// const app = express();
// const port = process.env.PORT || 2000;


// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


// //create the main route with different 
// app.use("/tht", usersRouter)
// app.use("/tht", questionsRouter)
// app.use("/tht", mallProductsRouter)
// app.use("/tht", eventProductsRouter)
// app.use("/tht", allColorImgRoute)
// app.use("/tht", QandARouter)
// app.use("/tht", iconsRouter)
// app.use("/tht", backgroundImgsRouter)
// app.use("/tht", levelsRouter)
// app.use("/tht", showingVideoRouter)
// app.use("/tht", warehouseAndCitiesRouter)
// app.use("/tht", modelNoHightWidthRouter)
// app.use("/tht", wifiModelNoHightWidthRouter)
// app.use("/tht", versionRouter)
// app.use("/tht", paymentRouter)


// //check the route 
// app.get('/', (req, res) => {
//   res.send({
//     message: "This is the 1st route"
//   })
// })


// //Check to Listen the port number 
// app.listen(port, () => {
//   console.log(`THT-Space Electrical Company Ltd Sever Running  on port ${port}`);
// })


// Import necessary packages
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Import the database connection pool
const fs = require('fs');
const path = require('path');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 2000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
  console.log("Database connected with thread ID:", connection.threadId);
  connection.release(); // Release the connection back to the pool
});

// Dynamically load all routes from the `routes` folder
const routePath = path.join(__dirname, 'routes');
fs.readdirSync(routePath).forEach((file) => {
  if (file.endsWith('.js')) {
    const route = require(`./routes/${file}`);
    app.use('/tht', route); // Attach each route to the `/tht` base path
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send({ message: "Server is running." });
});


// Graceful shutdown
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error("Error closing database pool:", err.message);
    } else {
      console.log("Database pool closed.");
    }
    process.exit(0); // Exit the process
  });
});



// Request timeout
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request Timeout');
  });
  next();
});



// Health check route
app.get('/health', (req, res) => {
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});