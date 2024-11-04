require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter=require('./routes/articles');
var ordersRouter=require('./routes/orders');
var genresRouter=require('./routes/genres');

//appel middlewares
var app = express();
const cors=require('cors');
//controle les origines des requetes
app.use(cors());
// protege les en-tete http des potentiel attaque 
app.use(helmet());
// protege contre les attaque de xss (injection de script)
app.use(xssClean());
// limitateur de requete par ip configure a 100 requete pour 10 minute
// app.use(rateLimit({
//     windowMs: 10 * 60 * 1000,  // 10 minute
//     max: 100,  //limite de 100
//     message: 'Trop de requêtes, veuillez réessayer plus tard.'
//   }));
  //protege contre les injections MongoDB en supprimant les caractères spéciaux comme $ et .
app.use(mongoSanitize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//les préfixe des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/orders', ordersRouter);
app.use('/genres', genresRouter);

module.exports = app;
