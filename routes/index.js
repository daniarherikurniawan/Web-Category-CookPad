var express = require('express');
var router = express.Router();

var post_cont = require('../controller/post_cont');
var user_cont = require('../controller/user_cont');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.profile!=null){
		post_cont.showTimeLine(req, res);
	}else{
		res.redirect('/login');
	}
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	if(req.session.profile!=null){
    	res.redirect('/');
	}else{
		res.render('login', { Message: ''});
	}
});

/* POST login page. */
router.post('/login', function(req, res, next) {
	user_cont.isAccountExist(req, function(feedback){
		res.send(feedback);
	});
});


/* POST signup. */
router.post('/signup', function(req, res, next) {
	// res.send(req.body);
	user_cont.registerNewUser(req, function(feedback){
		res.send(feedback);
	});
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
	res.render('signup', { Message: '' });
});


router.get('/logout', function(req, res, next) {
	user_cont.logout(req, res);
});


module.exports = router;
