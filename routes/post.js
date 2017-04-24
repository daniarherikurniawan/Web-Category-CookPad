var express = require('express');
var router = express.Router();

var post_cont = require('../controller/post_cont');
var user_cont = require('../controller/user_cont');


var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.post('/upload_image', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.uploadImage(req, res);
	}else{
		res.redirect('login', { Message: ''});
  	}
});

router.post('/create', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.create(req, res);
		res.send("start uploading image..")
	}else{
		res.redirect('login', { Message: ''});
  	}
});

router.post('/delete', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.delete(req, res);
	}else{
		res.redirect('login', { Message: ''});
  	}
});

router.post('/share', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.share(req, res);
	}else{
		res.redirect('login', { Message: ''});
  	}
});


router.post('/comments', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.getComments(req, res);
	}else{
		res.redirect('login', { Message: ''});
  	}
});

router.post('/add/comment', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		post_cont.addComment(req, res);
	}else{
		res.redirect('login', { Message: ''});
  	}
});

module.exports = router;
