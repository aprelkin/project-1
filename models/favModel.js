// load the things we need
var mongoose = require('mongoose');

// define the schema for our favorite model
var favSchema = mongoose.Schema({
    userID: String,
    announceID:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('FavModel', favSchema);
