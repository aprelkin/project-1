// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var announceSchema = mongoose.Schema({
    loc: [Number],
    userID: String,
    announcement : String,
    lat: Number,
    lng: Number,
    imgLength :Number,
    action:Array,
    imgs: Array,
    address: String,
    timeStamp:Object
});

announceSchema.index({"loc" : "2dsphere"});


// create the model for users and expose it to our app
module.exports = mongoose.model('AnnounceModel', announceSchema);
