var fs = require('fs');
var im = require('imagemagick');

var User = require('../dbhelper/user_model');
var hash = require("../public/javascripts/others/sha256.js");

module.exports = { 
	isAccountExist: function(req, callback){
		var username = req.body.username;
		var password = req.body.password;
		password = hash.sha256_digest(password);
		User.object
			.findOne({username: username, password: password})
			.select('-password')
			.exec( function(err, data){
			if( data == null ) {
				callback({
					status : "not exist",
					message : "Username or password is incorrect!"
				}); return;
	        } else {
        		req.session.profile = data;
				callback({
					status : "exist",
					message : "null"
				}); return;
		    }
		});
	},

	registerNewUser: function(req, callback){
		var username = req.body.username;
		var password = req.body.password;
		var password_rewrite = req.body.password_rewrite;
	  	if (password_rewrite === password){
	  		User.object
	  			.findOne({username: username}, function(err, data){

	  			if( data != null ) {
					callback({
						status : "failed",
						message : 'Register account failed! Username '+username+' is already exist!'
					}); return;
		        } else {
		        	var path =  "./public/images/"+username+"/"
		        	if (!fs.existsSync(path)){
		        		fs.mkdirSync(path);
		        	}
		        	var pathProfile = path+ "profile/"
		        	if (!fs.existsSync(pathProfile)){
		        		fs.mkdirSync(pathProfile);
		        	}
		        	pathProfile += "profile.jpg"
		        	fs.readFile("./public/template_images/profile.jpg", function(err, foto){
		        		fs.writeFile(pathProfile, foto, function(error){
		        		});  
		        	});

		        	var pathPosts = path+"posts/"
		        	if (!fs.existsSync(pathPosts)){
		        		fs.mkdirSync(pathPosts);
		        	}

					password = hash.sha256_digest(password);
		        	var userObj = new User.model({username: username, password: password});
		        	userObj.save();

					callback({
						status : "success",
						message : 'Hi '+ username +'! Your account is registered!'
					}); return;
				}
			});
	  	}else{
			callback({
				status : "failed",
				message : 'Register account failed! Confirmed password is incorrect!'
			}); return;
	  	}
	},

	logout: function(req, res){
		req.session.destroy();
		res.redirect('/login');
	},

}

