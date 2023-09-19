const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { LINK } = require('../utils/regex');
const NotFoundError = require('../error/NotFoundError');

const allowedCors = [
  'https://elegant.mesto.nomoredomains.monster',
  'http://elegant.mesto.nomoredomains.monster',
  'https://api.elegant.mesto.nomoredomains.monster',
  'http://api.elegant.mesto.nomoredomains.monster',
  'localhost:3000',
  'localhost:3002',
];

router.use(cors({
  origin: allowedCors,
  credentials: true,
}));

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
