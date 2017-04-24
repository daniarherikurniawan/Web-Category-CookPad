var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  creator:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  caption: String,
  image_name: String,
  original_creator:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ content: String, 
    date_created: { type: Date, default: Date.now},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  date_created: { type: Date, default: Date.now},
});
mongoose.model('Post',PostSchema);

module.exports = { 
  model : mongoose.model('Post', PostSchema),
  object: mongoose.model('Post'),
}