// load the things we need
var mongoose = require('mongoose');

// define the schema for our favorite model
var placeSchema = mongoose.Schema({
    userIds: Array,
    messageIds:Array,
    tags:Array,
    lat: Number,
    lng: Number,
    address:String,
    radius:Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('PlaceModel', placeSchema);
