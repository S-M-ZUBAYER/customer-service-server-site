const express=require("express")
const connection=require("../config/db")
const multer = require('multer');
const path = require('path');
const router=express.Router()
const cors = require("cors");
const upload = multer({ dest: 'uploads/' });

const app=express();
app.use(cors())


router.get('/eventProducts', (req, res) => {
    connection.query('SELECT * FROM eventproducts', (error, results) => {
      if (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Error retrieving products');
      } else {
        res.json(results);
      }
    });
  });



// router.post('/eventproducts/add',(req,res)=>{
//     // INSERT INTO `eventproducts`(`id`, `productName`,`productPrice`,`productDescription`,`modelNumber`,`printerColor`,`connectorType`,`stockQuantity`,`shelfStartTime`,`shelfEndTime`,`afterSalesText`,`afterSalesInstruction`,`inventoryText`,`invoiceFile`) VALUES ('[value-1]','[value-2]','[value-3]')
//     const allQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allQuestions)
//     let sql="INSERT INTO questions (email,question,date,time) VALUES (?)";
//     connection.query(sql,[allQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });

    router.post('/eventProducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFile' }]), (req, res) => {
    // router.post('/eventproducts/add', upload.fields([{ name: 'productImg' }, { name: 'invoiceFile' }]), (req, res) => {
        const {
          productName,
          productPrice,
          productDescription,
          modelNumber,
          printerColor,
          connectorType,
          stockQuantity,
          shelfStartTime,
          shelfEndTime,
          afterSalesText,
          afterSalesInstruction,
          inventoryText
        } = req.body;
      
        const productImg = req.files['productImg'][0];
        const invoiceFile = req.files['invoiceFile'][0];
      
        const product = {
          productName,
          productPrice,
          productDescription,
          modelNumber,
          printerColor,
          connectorType,
          stockQuantity,
          shelfStartTime,
          shelfEndTime,
          afterSalesText,
          afterSalesInstruction,
          inventoryText,
          productImg: productImg.filename,
          invoiceFile: invoiceFile.filename
        };
      console.log(product)
        connection.query('INSERT INTO eventproducts SET ?', product, (error, results) => {
          if (error) {
            console.error('Error creating product:', error);
            res.status(500).send('Error creating product');
          } else {
            console.log('Product created successfully');
            res.send('Product created successfully');
          }
        });
      });
      





// //part for get and post data for all of the unknown questions
// router.get('/unknownQuestions', (req, res) => {
//     const email = req.query.email;
  
//     // Perform a query to find data by email
//     const query = `SELECT * FROM unknownquestions WHERE email = '${email}'`;
  
//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'An error occurred' });
//       } else {
//         res.json(results);
//       }
//     });
//   });



// router.post('/unknownQuestions/add',(req,res)=>{
//     // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
//     const allUnknownQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allUnknownQuestions)
//     let sql="INSERT INTO unknownquestions (email,question,date,time) VALUES (?)";
//     connection.query(sql,[allUnknownQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("Unknown successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });




// //part for get and post data for all of the unknown questions
// router.get('/translationsQuestions', (req, res) => {
//     const email = req.query.email;
//     console.log(email)
  
//     // Perform a query to find data by email
//     const query = `SELECT * FROM translationsquestions WHERE email = '${email}'`;
  
//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'An error occurred' });
//       } else {
//         res.json(results);
//       }
//     });
//   });



// router.post('/translationsQuestions/add',(req,res)=>{
//     // INSERT INTO `questions`(`id`, `unknownQuestion`,`email`,`date`,`time`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
//     const allTranslationsQuestions=[
//         req.body.email,
//         req.body.question,
//         req.body.english,
//         req.body.bangla,
//         req.body.date,
//         req.body.time,

//     ]
//     console.log(allTranslationsQuestions)
//     let sql="INSERT INTO translationsquestions (email,question,english,bangla,date,time) VALUES (?)";
//     connection.query(sql,[allTranslationsQuestions],(err,result)=>{
//         if(err) throw err;
//         console.log("Translations questions successfully inserted");
//         res.json(result);
//         // res.redirect("/users")
//     })
//     // res.send("THT-Space Electrical Company Ltd Sever Running")
//     // res.status(200).json({"message":"Success"});
//     });



module.exports=router;