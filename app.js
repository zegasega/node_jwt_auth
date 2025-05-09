const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require("cors")


const userRoutes = require("./routes/userRoutes")

const limiter = rateLimit({
  windowMs: 1000, // 1 saniye
  max: 100,       // Her IP'den saniyede en fazla 100 istek
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please slow down.'
    }
  }
});

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(morgan('dev'));



app.use("/user", userRoutes)

app.get('/', (req, res) => {
  res.send('API çalışıyor 🚀');
});



module.exports = app;
