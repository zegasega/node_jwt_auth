const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require("cors")
const routes = require("./routes/routes")
const helmet = require('helmet');


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

const corsOptions = {
  origin: ['http://localhost:3000'],                 // Sadece bu origin'lerden gelen isteklere izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Hangi HTTP metodlarına izin verileceği
  allowedHeaders: ['Content-Type', 'Authorization'], // Hangi header'lara izin verileceği
  credentials: true,                                 // Tarayıcıdan gelen cookie, authorization header vb. bilgiler iletmeye izin verir
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));


app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(morgan('dev'));

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);
app.get('/', (req, res) => {
  res.send('API çalışıyor 🚀');
});

module.exports = app;
