//This is the part to require necessary package

const express = require('express');
const cors = require('cors');
const mysql = require("mysql");

//here start the link up with the different route from the index.js file
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/customerService");
const mallProductsRouter = require("./routes/mallProducts");
const eventProductsRouter = require("./routes/eventProduct");
const allColorImgRoute = require("./routes/productColorImgs");
const QandARouter = require("./routes/QandA");
const iconsRouter = require("./routes/addIcons");
const backgroundImgsRouter = require("./routes/addBackground");
const levelsRouter = require("./routes/level");
const showingVideoRouter = require("./routes/showingVideo");
const warehouseAndCitiesRouter = require("./routes/addWarehouseAndCities");
const modelNoHightWidthRouter = require("./routes/addBluetoothModelNoHightWidth");
const wifiModelNoHightWidthRouter = require("./routes/addWifiModelNoHightWidth");
const versionRouter = require("./routes/version&othersInfo");
const paymentRouter = require("./routes/PaymentRouter");

//require the config file to connect with database
const connection = require("./config/db")


const app = express();
const port = process.env.PORT || 2000;
// const port=5000;


//user: tht_user
//password: TAJcWX5EJsJKD8jT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//create a function to connect with database
connection.connect((err) => {
  if (err) throw err;
  console.log("Db is connected successfully:", connection.threadId)
})


//create the main route with different 
app.use("/tht", usersRouter)
app.use("/tht", questionsRouter)
app.use("/tht", mallProductsRouter)
app.use("/tht", eventProductsRouter)
app.use("/tht", allColorImgRoute)
app.use("/tht", QandARouter)
app.use("/tht", iconsRouter)
app.use("/tht", backgroundImgsRouter)
app.use("/tht", levelsRouter)
app.use("/tht", showingVideoRouter)
app.use("/tht", warehouseAndCitiesRouter)
app.use("/tht", modelNoHightWidthRouter)
app.use("/tht", wifiModelNoHightWidthRouter)
app.use("/tht", versionRouter)
app.use("/tht", paymentRouter)


//check the route 
app.get('/', (req, res) => {
  res.send({
    message: "This is the 1st route"
  })
})


//Check to Listen the port number 
app.listen(port, () => {
  console.log(`THT-Space Electrical Company Ltd Sever Running  on port ${port}`);
})