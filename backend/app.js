// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const rootRoute = require('./routes/index');
const genErrorHandler = require('./middlewares/genErrorHandler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'https://elegant.mesto.nomoredomains.monster',
  'http://elegant.mesto.nomoredomains.monster',
  'https://api.elegant.mesto.nomoredomains.monster',
  'http://api.elegant.mesto.nomoredomains.monster',
  'localhost:3000',
  'localhost:3002',
];

const { PORT = 3000 } = process.env;
const app = express();

app.options(
  '*',
  cors({
    origin: allowedCors,
    credentials: true,
  }),
);

app.use(
  cors({
    origin: allowedCors,
    credentials: true,
  }),
);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
// app.use(cors);
app.use(requestLogger); // подключаем логгер запросов
app.use('/', rootRoute);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(genErrorHandler);

app.listen(PORT);
