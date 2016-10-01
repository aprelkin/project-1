// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var authMailSchema = mongoose.Schema({
    userId: String,
    username: String,
    email: String,
    success: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('AuthMailModel', authMailSchema);
