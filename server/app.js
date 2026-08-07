var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require('./config/database')
const api = require('./api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

dotenv.config();
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  credentials: true,
  origin: corsOrigins,
}));
app.use(logger('dev'));
// Default 100kb is too small for a course payload with rich-text descriptions
// and multiple sections/lessons embedded in a single create request.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;

  // API consumers (the SPA) always expect JSON, never an HTML error page
  if (req.originalUrl.startsWith('/api')) {
    if (statusCode >= 500) {
      console.error(err);
    }
    return res.status(statusCode).json({
      statusCode,
      message: statusCode >= 500 ? 'Internal Server Error' : err.message,
      error: http.STATUS_CODES[statusCode] || 'Error',
      ...(req.app.get('env') === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(statusCode);
  res.render('error');
});


module.exports = app;
