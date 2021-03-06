require('./models/connection');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var session = require("express-session");
var app = express();
app.use(
  session({
   secret: 'a4f8071f-c873-4447-8ee2',
   resave: false,
   saveUninitialized: false,
  })
  );
//helpers
app.locals.dateFormat =function (date){
  let dateUTC=new Date(date);
  let datefr= dateUTC.toLocaleString('en-GB').slice(0, 10);
  return datefr;
}

app.locals.timeFormat = function (time){
   const timeSplit= time.split(":");
   var h12='am';
  if (timeSplit[0] > 12){
    var h12= "pm"
    } 
  return h12;
}
//   let time12= timeUTC.toLocaleString('en-GB',{ hour:'numeric', minute:'numeric', hour12:true });
//   return time12;
// }
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
