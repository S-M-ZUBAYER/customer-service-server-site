const express= require('express');
const cors = require('cors');
const mysql=require("mysql");
const usersRouter=require("./routes/users");
const questionsRouter=require("./routes/customerService");
const mallProductsRouter=require("./routes/mallProducts");
const eventProductsRouter=require("./routes/eventProduct");
const QandARouter=require("./routes/QandA");
const iconsRouter=require("./routes/addIcons");
const connection=require("./config/db")


const app=express();
const port=process.env.PORT || 5000;


//user: tht_user
//password: TAJcWX5EJsJKD8jT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));



connection.connect((err)=>{
  if(err) throw err;
  console.log("Db is connected successfully:", connection.threadId)
})



app.use("/tht",usersRouter)
app.use("/tht",questionsRouter)
app.use("/tht",mallProductsRouter)
app.use("/tht",eventProductsRouter)
app.use("/tht",QandARouter)
app.use("/tht",iconsRouter)


const users=[
    {
      name: "John Doe",
      email: "johndoe@email.com",
      phone: "555-555-5555",
      designation: "Developer",
      country: "United States",
      language: "English"
    },
    {
      name: "Jane Smith",
      email: "janesmith@email.com",
      phone: "555-555-5556",
      designation: "Designer",
      country: "Canada",
      language: "English"
    },
    {
      name: "Carlos Garcia",
      email: "carlosgarcia@email.com",
      phone: "555-555-5557",
      designation: "Manager",
      country: "Mexico",
      language: "Spanish"
    },
    {
      name: "Hiroshi Tanaka",
      email: "hiroshit@example.com",
      phone: "555-555-5558",
      designation: "Engineer",
      country: "Japan",
      language: "Japanese"
    },
    {
      name: "Marta Fernández",
      email: "martafernandez@example.com",
      phone: "555-555-5559",
      designation: "Marketing Specialist",
      country: "Spain",
      language: "Spanish"
    }
  ];


  const products = [
    { name: "Product 1", modelNo: "M1" },
    { name: "Product 2", modelNo: "M2" },
    { name: "Product 3", modelNo: "M3" },
    { name: "Product 4", modelNo: "M4" },
    { name: "Product 5", modelNo: "M5" },
    { name: "Product 6", modelNo: "M6" },
    { name: "Product 7", modelNo: "M7" }
  ];
  
  const accountInfo={
    name:"S M Zubayer",
designation: "Customer Service",
phone: +8801304979278,
email: "smzubayer9004@gmail.com",
country: "Bangladesh",
language: "Bengali", 
pic: 'https://ibb.co/KN5kN1M'
  }



app.get('/users',(req,res)=>{
res.send(users)
});

app.get('/mall',(req,res)=>{
res.send(products)
});
app.get('/event',(req,res)=>{
res.send(products)
});
app.get('/userInfo',(req,res)=>{
res.send(accountInfo)
});



app.listen(port,()=>{
console.log(`THT-Space Electrical Company Ltd Sever Running  on port ${port}`);
})