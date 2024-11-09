const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pageNotFound, errorHandler } = require('./middleware/errorHandler');
const indexRoute = require('./routes/indexRoute')
const dotenv = require("dotenv").config();
const compression = require('compression');
const bodyParser = require('body-parser');
const axios = require("axios");
//database


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nguyenanh1997dz@gmail.com",
      pass: "rufdgifdaubyocql",
    },
  });

  const sendNotificationEmail = async () => {
    try {
      const response = await axios.post(
        'https://brave-inspiration-production.up.railway.app/api/v1/ticket/verify-email',
        {
          email: "votanphu150102@gmail.com"
        }
      );
      console.log("Email notification sent successfully:", response.data);
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  };

require('./config/db')
// server configuration
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: [process.env.BASE_CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
  const submitForm = () => {
        const formData = new FormData();
        formData.append('email', '123@123.com');
        formData.append('formId', 'v2SsozD8Ue4yo9S8tzTK');
        formData.append('location_id', '5lf8tjgIX9svVGbrjYkn');
        formData.append('eventData[source]', 'direct');
        formData.append('eventData[referrer]', '');
        formData.append('eventData[keyword]', '');
        formData.append('eventData[adSource]', '');
        formData.append('eventData[page][url]', 'https://api.leadconnectorhq.com/widget/form/v2SsozD8Ue4yo9S8tzTK?notrack=true');
        formData.append('eventData[page][title]', '');
        formData.append('eventData[timestamp]', '1731100170328');
        formData.append('Timezone', 'Asia/Bangkok (GMT+07:00)');
        formData.append('paymentContactId', '{}');
        axios.post('https://backend.leadconnectorhq.com/forms/submit', formData)
            .then(response => console.log('Response:', response.data))
            .catch(error => console.error('Error:', error.response ? error.response.data : error.message));
    };

    


const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "channel": "APP",
    "origin": "https://member.xbizfunnels.com",
    "priority": "u=1, i",
    "referer": "https://member.xbizfunnels.com/",
    "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "source": "PORTAL_USER",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "version": "2023-02-21",
    "x-group-id": "67257fe5787da67b33acec0f",
    "x-location-id": "qSYFmxPyrdywNzKI5H4W"
  };
  const url = "https://services.leadconnectorhq.com/communities/qSYFmxPyrdywNzKI5H4W/groups/67257fe5787da67b33acec0f/public/posts?limit=20";
// 
let previousData = null;
const checkAPI = async () => {
    try {
      const response = await axios .get(url, { headers })
      const newData = response.data;
      if (JSON.stringify(newData) !== JSON.stringify(previousData)) {
        await sendNotificationEmail(newData);
          submitForm();
        previousData = newData; // Cập nhật dữ liệu cũ
        console.log('gửi mail',newData.length);
        
      }
    } catch (error) {
      console.error("Kiểm tra API thất bại:", error);
    }
  };
  setInterval(() => {
    checkAPI()
  }, 5000); 







// Middleware Morgan
app.use(morgan("dev"));

// Xử lý yêu cầu Preflight OPTIONS
app.options('*', cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.use(indexRoute)

// dùng để ngăn render tự sleep
app.get("/ping", (req, res) => {
    return res.json({
        message: "Ping server"
    })
});
// error handler
app.use('*', pageNotFound)
app.use(errorHandler)
