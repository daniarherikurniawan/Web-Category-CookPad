var fs = require('fs');
var im = require('imagemagick');

var Post = require('../dbhelper/post_model');
var User = require('../dbhelper/user_model');

function copyImage(source, destination, callback){
	fs.readFile(source, function(err, data){
		fs.writeFile(destination, data, function(error){
			if (error) 
				console.log(error);
			callback()
			}
		);  
	});
}

module.exports = { 
	uploadImage: function(req, res){
		var img = req.files.img_profile;
		fs.readFile(img.path, function(err, data){
			if(err || req.session.post_id == null){
				return res.redirect("/tmpError/"+err);
			}

			var path =  "./public/images/"+req.session.profile.username+"/"
			if (!fs.existsSync(path)){
				fs.mkdirSync(path);
				
			}
			path += "posts/";
			if (!fs.existsSync(path)){
				fs.mkdirSync(path);
			}

			path += req.session.post_id+img.originalFilename;

			fs.writeFile(path, data, function(error){
				if (error) 
					console.log(error);

				req.session.post_id = null;
				return res.redirect("/");
				}
			);  
		});
	},

	showTimeLine: function(req, res){
		Post.object
			.find()
			.populate({
				  	path: 'creator',
		  			select: 'username img_profile_name'
				})

			.populate({
				  	path: 'original_creator',
		  			select: 'username img_profile_name'
				})
			.sort({date_created: 'desc'})
			.exec(function (err,dataPost){
			if(err){
				console.log(err);
				res.send("404");
			}else	{
	            for (var i = dataPost.length - 1; i >= 0; i--) {
	            	if(dataPost[i].creator._id == req.session.profile._id)
	            		dataPost[i].myPost = true;
	            };
  				res.render('index', { profile: req.session.profile, posts: dataPost });
			}
		});
	},

	getComments: function(req, res){
		Post.object
			.findById(req.body.id, function(err, post){
			Post.object
				.populate(post.comments, {path: 'creator',
		  			select: 'username img_profile_name' }, 
					function (err,comments){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					res.send(comments);
				}
			});
		});
	},

	addComment: function(req, res){
		idUser = req.session.profile._id;
		idPost = req.body.id;
		content = req.body.content
		Post.object.findById(idPost,
		    function(err, post){
		      objComment = new Object();
		        objComment.content = content;
		        objComment.creator = idUser;
		      post.comments.push(objComment);
		      post.save();
		      res.send("Your comment has been added !")
		});
	},


	share: function(req, res){
		caption = req.body.caption;
		original_post_id = req.body.id;
		idUser = req.session.profile._id;

		Post.object
			.findById(original_post_id)
			.populate('creator')
			.exec(function (err,dataPost){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				var postObj = new Post.model({creator: idUser, original_creator: dataPost.creator._id,
				 caption: caption});
			  	postObj.save();
			  	postObj.image_name = postObj._id+"."+dataPost.image_name.split('.').pop();;
			  	postObj.save();
			  	source = "./public/images/"+dataPost.creator.username+"/posts/"+dataPost.image_name;
			  	destination = "./public/images/"+req.session.profile.username+"/posts/"+postObj.image_name;
			  	copyImage(source, destination, function (callback){
			  		res.send("Success to share the post!")
			  	})
			}
		});
	},

	create: function(req, res){
		caption = req.body.caption;
		idUser = req.session.profile._id;
		var postObj = new Post.model({creator: idUser, caption: caption});
	  	postObj.save();
	  	postObj.image_name = postObj._id+req.body.image_name;
	  	postObj.save();
	  	req.session.post_id = postObj._id;
	},

	delete: function(req, res){
		idUser = req.session.profile._id;
		idPost = req.body.id;
		
		Post.object
			.findById(idPost)
			.populate({
				  	path: 'creator',
		  			select: 'username img_profile_name'
				})
			.exec(function (err, post){
				if(post.creator._id == idUser){
		          	post.remove();
		          	res.send("Your post has been deleted!")
				}
		        else{
		          	res.send("Sorry, you do not have the rights to delete this post!")
		        }

        });
	}
		

}



