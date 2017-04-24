var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  img_profile_name: {type: String, default: "profile.jpg"},
  date_created: { type: Date, default: Date.now},
});     
mongoose.model('User',UserSchema);

module.exports = { 
  model : mongoose.model('User', UserSchema),
  object: mongoose.model('User')
}