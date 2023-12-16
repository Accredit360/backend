var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
require('./db');

var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var logger = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config(); 
require('./tokenManager');

var app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));


// Require and use your routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const indexRoutes = require('./routes/indexRoutes');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Accredit360 API doc',
      version: '1.0.0',
      description: 'API documentation for Accredit360 application.',
    },
  },
  apis: ['./routes/*.yaml'], // Point to the directory where your route files are located
};
const customOptions = {
  customCss: `
  .swagger-ui .topbar .topbar-wrapper, .swagger-ui .topbar a{
    display:none;
  }
  `,
  customSiteTitle: 'Accredit360 API doc',
  customfavIcon: '/public/your-logo.png', // Update the path to your logo image
};


const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, customOptions));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/', indexRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

