var express = require('express');
var router = express.Router();
var db_connect = require('../db_connect');
var fs = require('fs');

function validateLogin(uname, pwd, cb) {
	db_connect.reuse(function(db) {
		db.collection('admin').findOne({username: uname, password: pwd}, function(err, admin) {
			if(err) {
				console.log(err);
				cb(err);
			}
			else if(!admin) {
				cb(null, false);
			}
			else {
				cb(null, true);
			}
		});
	});
}

/* login page */
router.get('/', function(req, res, next) {
	if(req.session.isLoggedIn) {
		res.redirect('/snapchallenge/admin');
		return;
	}
	res.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
	res.render('login');
});

router.post('/', function(req, res) {
	if(req.session.isLoggedIn) {
		res.redirect('/snapchallenge/admin');
		return;
	}
	var uname = req.body.username,
		pwd = req.body.password;

	var errorMessages = [];
	if(!uname || typeof uname !== "string" || !uname.trim())
	{
		errorMessages.push("Username missing.");
	}
	else if(!uname || typeof uname !== "string" || !uname.trim())
	{
		errorMessages.push("Password missing.");
	}
	else {
		validateLogin(uname,pwd,function(err,result) {
			if(err) {
				console.log(err);
				res.render('error', {
					message: 'Internal Server Error. Retry in a while.',
					error: {}
				});
			}
			else if(result) {
				req.session.isLoggedIn = true;
				req.session.username = uname;
				req.session.department = result.department;
				res.redirect('/snapchallenge/admin');
			}
			else {
				res.render('login', {
					errorMessage: 'Invalid login credentials.'
				});
			}
		});
		return;
	}

	res.render('login',{
		errorMessage: errorMessages.join("<br>")
	});
});

module.exports = router;
