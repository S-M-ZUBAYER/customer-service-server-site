//Require necessary packages

const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const requestIP = require('request-ip');
const axios = require('axios');


const app = express();
app.use(cors());



const crypto = require('crypto');
const https = require('https');

const REQ_URL = 'https://gwapi.mabangerp.com/api/v2';
const APP_KEY = '201366'; // Replace with your actual App Key
const APP_TOKEN = '5d03f1bb8250d0be59fec54ce1d9be9d'; // Replace with your actual App Token

// Function to create an HMAC SHA256 hash
const hmacsha256 = (str, key) => {
  return crypto.createHmac('sha256', key)
    .update(str, 'utf8')
    .digest('hex');
};

// Function to call Mabang API
const mabangcall = (api, reqParams, callback) => {
  let data = {
    api: api,
    appkey: APP_KEY,
    data: reqParams,
    timestamp: parseInt((new Date().getTime()) / 1000)
  };
  let content = JSON.stringify(data);
  let authorization = hmacsha256(content, APP_TOKEN);
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Authorization": authorization
    }
  };
  let req = https.request(REQ_URL, options, (res) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      let json = JSON.parse(body);
      callback(json);
    });
  });
  req.on('error', (e) => {
    console.log("error", e.message);
  });
  req.write(content);
  req.end();
};

// Example of creating an order
mabangcall('order-do-create-order', {
  platformOrderId: "ORD12345",      // Order number (letters, numbers, underscores, bars)
  buyerUserId: "12345",             // Buyer Number
  street1: "123 Buyer St, Suite 100", // Buyer Address 1
  // Additional required fields
  countryCode: "US",                // Buyer country code
  name: "John Doe",                 // Buyer name
  phone1: "+1234567890",            // Buyer's phone (optional as per update)
  orderItems: [
    {
      title: "商品标题",               // Product title
      platformSku: "SKU123456",     // Platform SKU
      quantity: 2,                  // Quantity
      pictureUrl: "https://example.com/images/item.jpg"  // Product image URL
    }
  ],
  // Include other optional or necessary fields for order creation
}, (result) => {
  console.log("result", result); // Output the API response
});


//create the route and function to get the the Question Answer store according to the email address

router.get('/QandAnswers', (req, res) => {
  const email = req.query.email;

  const query = `SELECT * FROM questionanswers WHERE email = '${email}'`;

  connection.query(query, (error, results) => {
    if (results) {
      res.json(results);
    }
    else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
});



//create the route and function to add new Question answer according to email address

router.post('/QandAnswers/add', (req, res) => {

  const QandA = [
    req.body.email,
    req.body.question,
    req.body.answer,
    req.body.date,
    req.body.time
  ]
  let sql = "INSERT INTO questionanswers (email,question, answer,date,time) VALUES (?)";
  connection.query(sql, [QandA], (err, result) => {
    if (err) throw err;
    console.log("successfully inserted");
    res.json(result);
  })

});





//create the route and function to update Question answer according to email address

router.put('/QandAnswers/update/:id', (req, res) => {

  console.log("update user");

  const { email, question, answer, date, time } = req.body;

  let sql = `UPDATE questionanswers SET email='${email}', question='${question}', answer='${answer}',date='${date}', time='${time}' WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully updated", result);
    res.json(result);;
  });

});


//create the route and make api to update about, date, time

router.put('/about/update', (req, res) => {

  const { about, date, time } = req.body;

  let sql = `UPDATE about SET about='${about}',date='${date}', time='${time}' WHERE id=1`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("About information successfully updated", result);
    res.json(result);;
  });

});


//create the route and function to get the about information 
router.get('/about', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM about WHERE id = 1`;

  connection.query(query, (error, results) => {
    if (results && results.length > 0) {
      res.json(results);
    } else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred or no results found' });
    }
  });
});



//create the route and make api to update about, date, time

router.put('/helpCenter/update', (req, res) => {

  const { helpCenter, date, time } = req.body;

  let sql = `UPDATE helpCenter SET helpCenter='${helpCenter}',date='${date}', time='${time}' WHERE id=1`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("Help Center information successfully updated", result);
    res.json(result);;
  });

});

//create the route and function to get the about information 
router.get('/helpCenter', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM helpCenter WHERE id = 1`;

  connection.query(query, (error, results) => {
    if (results && results.length > 0) {
      res.json(results);
    } else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred or no results found' });
    }
  });
});


//create the route and make api to Help Center about, date, time

router.put('/businessCooperation/update', (req, res) => {

  const { businessCooperation, date, time } = req.body;
  let sql = `UPDATE businessCooperation SET businessCooperation='${businessCooperation}',date='${date}', time='${time}' WHERE id=1`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("Business Cooperation information successfully updated", result);
    res.json(result);;
  });

});

//create the route and function to get the Business Cooperation information 
router.get('/businessCooperation', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM businessCooperation WHERE id = 1`;

  connection.query(query, (error, results) => {
    if (results && results.length > 0) {
      res.json(results);
    } else {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred or no results found' });
    }
  });
});


// router.post('/api/add-order', async (req, res) => {
//   console.log(req.body);
//   try {
//     const response = await axios.post(
//       'https://gwapi.mabangerp.com/api/v2/orders/add',
//       req.body,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           // 'Authorization': `Bearer YOUR_APP_SECRET` // Use a valid token here
//           // 'Authorization': `Bearer 5d03f1bb8250d0be59fec54ce1d9be9d` // Use a valid token here
//           'Authorization': `Bearer 201366` // Use a valid token here
//         }
//       }
//     );
//     console.log(response.data, response.status);
//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).send('Failed to add order');
//   }
// });

// router.get('/api/order-list', async (req, res) => {
//   try {
//     const response = await axios.get(
//       'https://gwapi.mabangerp.com/api/v2/orders', // Replace with the actual API endpoint for fetching the order list
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer 201366` // Use a valid token here
//         }
//       }
//     );
//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).send('Failed to fetch order list');
//   }
// });

// POST route to add an order
router.post('/api/add-order', async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post(
      'https://gwapi.mabangerp.com/api/v2/orders/add', // Replace with the actual endpoint for adding orders
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 201366`
        }
      }
    );
    console.log(response.status, response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error adding order:', error.message);
    res.status(500).send('Failed to add order');
  }
});

// GET route to fetch the order list
router.get('/api/order-list', async (req, res) => {
  const platformOrderId = req.query.platformOrderId; // Assuming the platform order ID is passed as a query parameter
  const status = req.query.status; // Assuming the order status is passed as a query parameter

  try {
    const response = await axios.post('https://gwapi.mabangerp.com/api/v2', {
      api: 'order-get-order-list',
      data: {
        platformOrderIds: platformOrderId,
        status: status
      },
      timestamp: Math.floor(Date.now() / 1000) // Current timestamp in seconds
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 201366`
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching order list:', error.message);
    res.status(500).send('Failed to fetch order list');
  }
});
//create the route and function to add delete specific Question answer according to the id

router.delete('/QandAnswers/delete/:id', (req, res) => {
  const sql = `DELETE FROM questionanswers WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully Delete", result);
    res.json(result);
  });
});

router.get('/detectIP', function (req, res) {
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

  console.log(parseIp(req))
  const ipAddress = requestIP.getClientIp(req);
  res.send(ipAddress)
});




module.exports = router;