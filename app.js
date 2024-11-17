require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter=require('./routes/articles');
var ordersRouter=require('./routes/orders');
var genresRouter=require('./routes/genres');
var shipmentsRouter=require('./routes/shipments');

//appel middlewares
var app = express();
const cors=require('cors');

//controle les origines des requetes
app.use(cors());

// protege les en-tete http des potentiel attaque 
app.use(helmet());

// protege contre les attaque de xss (injection de script)
app.use(xssClean());

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
app.use('/shipments', shipmentsRouter);

module.exports = app;
