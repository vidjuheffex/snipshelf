//core dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mustacheExpress = require('mustache-express');
var session = require(('express-session'));
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbConfig = require('./config/config-database.js');

//routes
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//mongodb setup
//mongoose.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@ds023054.mlab.com:23054/${dbConfig.username}`, {useMongoClient: true})

mongoose.connect(`mongodb://localhost:27017/snippetsDB`, {useMongoClient: true})
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch(err => {
    throw err;
  });

//the following configs are *NOT* committed, for security reasons
//please contanct maintainer for access to the necessary files
var sessionConfig = require('./config/config-session.js');

// view engine setup
app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

//session setup
app.use(session(sessionConfig));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', err);
});

module.exports = app;


