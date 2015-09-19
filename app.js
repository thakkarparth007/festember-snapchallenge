var express = require('express');
var layout = require('express-layout');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var restrict = require('./middleware/restrict');

var home = require('./routes/home');
var login = require('./routes/login');
var admin = require('./routes/admin');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

app.sessionMiddleware = session({
  secret: 'LOLCODEROXMENNYOYOBBZSINGHU!',
  resave: false,
  saveUninitialized: true
});
app.use(app.sessionMiddleware);

app.use('/snapchallenge/', express.static(path.join(__dirname, 'public')));
app.use(layout());

app.use('/snapchallenge/', home)
app.use('/snapchallenge/login', login);
app.use(restrict);
app.use('/snapchallenge/uploads/', express.static(path.join(__dirname, 'uploads')));
app.use('/snapchallenge/admin', admin);
app.use('/snapchallenge/',logout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.render('404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
