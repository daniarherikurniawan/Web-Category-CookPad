module.exports = { 
	connect: function(){
		var mongoose = require('mongoose');
		var url = 'mongodb://localhost:27017/simplegramdb';
		mongoose.connect(url);
	}
}