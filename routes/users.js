var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var imageHelper = require('../helpers/imageHelper');
var path = require('path');
var fs = require('fs');
var request = require('request');

var User = require('../models/user');

var profilePicturesDir = path.join(__dirname, '../public/uploads/ProfilePictures/');

// Display registeration form
router.get('/register', function(req, res) {
  res.render('register');
});

// Submit registration Form
router.post('/register', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = [];
	var reqErr = req.validationErrors();
	for(var i = 0; i < reqErr.length; i++){
		errors.push(reqErr[i]);
	}
	async.series([function(callback){
		if(!email){
			callback(null,{UserKey: 0})
		}else{
			User.getUserByUsername(email,function(err, result){
				if(err) throw err;
				callback(null, result);
			});
		}
	}
	], function(err, results){
		if(results[0]){
			errors.push({param:'email', msg: 'Email is already registered to another account', value:''})
		}
		if(errors.length > 0){
			res.render('register',{
				errors:errors
			});
		} else {
			var newUser = {
				firstname: firstname,
				lastname: lastname,
				email: email,		
				password: password,
			};

			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});

			req.flash('success_msg', 'You are registered and can now login');

			res.redirect('/users/login');
		}		
	});
  
});

// Display login form
router.get('/login', function(req, res) {
  res.render('login');
});

// Submit Login Form
router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/home', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
});

// helper method for login validation
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.Password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.UserKey);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// Log Out
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


// Home Page
router.get('/home', function(req, res) {
	
	res.render('home', {userFirstName: req.user.FirstName});


});


module.exports = router;
