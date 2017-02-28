var bcrypt = require('bcryptjs');
var db = require('../db.js');

exports.createUser = function(newUser, done) {
	const saltRounds = 10;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(newUser.password, salt);

	// values to insert
	var values = [newUser.firstname, newUser.lastname, newUser.email, hash]
 	db.get().query('INSERT INTO User (FirstName, LastName, Email, Password) VALUES(?, ?, ?, ?)', values, function(err, result) {
		if (err) return done(err)
    	done(null, result.insertId)
	})
}

exports.getUserByUsername = function(username, done){
	db.get().query('SELECT * FROM User WHERE Email = ?', username, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows[0])
  	})
}

exports.getUserById = function(id, done){
	db.get().query('SELECT * FROM User WHERE UserKey = ?', id, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows[0])
  	})
}

exports.updateGeneric = function(updateObject, done){
	db.get().query('UPDATE ' + updateObject.table + ' SET ? WHERE ?', updateObject.params, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}

exports.selectGeneric = function(selectObject, done){
	db.get().query('SELECT * FROM ' + selectObject.table + ' WHERE ?', selectObject.params, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}

exports.insertGeneric = function(insertObject, done){
	db.get().query('INSERT INTO ' + insertObject.table + ' SET ?', insertObject.params, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows.insertId);
  	})
}

exports.deleteGeneric = function(deleteObject, done){
	db.get().query('DELETE FROM ' + deleteObject.table + ' WHERE ?', deleteObject.params, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}



exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
