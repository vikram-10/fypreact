var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientDataRouter = require('./routes/clientdata');
var reguser=require('./routes/reguser');
var sendimg=require('./routes/sendimg');
var userInfo=require('./routes/userinfo');
var recvImg=require('./routes/test');
var getDetails=require('./routes/getdetails');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clientdata', clientDataRouter);
app.use('/reguser', reguser);
app.use('/sendimg', sendimg);
app.use('/userinfo', userInfo);
app.use('/uploads', express.static('uploads'));
app.use('/recvimg',recvImg);
app.use('/getdetails',getDetails);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
