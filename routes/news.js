
var mongoose = require('mongoose');
var FavModel = require('../models/favModel');
var AnnounceModel = require('../models/announceModel');
var UserModel = require('../models/userModel');

exports.index = function(req, res){

   var announceID = req.query.id;
   var about = req.query.about;

    if(!mongoose.Types.ObjectId.isValid(announceID))
    {
        res.status(404).send('404: Page not Found');
        return;
    }

    var username = "";
    var userID = 0;

    if(typeof req.user !== "undefined")
    {
        username = (typeof req.user.facebook.name!=="undefined"?req.user.facebook.name:typeof req.user.twitter.username !== "undefined"?"@"+req.user.twitter.username:typeof req.user.google.name !== "undefined"?req.user.google.name:req.user.local.username);
        userID = req.user._id;
    }

   var announcements = new Array();

   var query = AnnounceModel.findOne(mongoose.Types.ObjectId(announceID));

       query.exec(function (err, announce) {

            if (err) console.log("Announce not found" + err);

            if(announce == null)
            {
                res.render('news', { title: 'Locale Nachricht', ancmts: announcements});
                return;
            }

            var obj = {};
            obj.time = timeConverter(announce.timeStamp);
            obj.rest = announce;
            obj.fav = 0;
            obj.userID = announce.userID;

            FavModel.find({announceID:announceID}, function (err, docs) {

                if (err) console.log("Favs not found"+ err);

                obj.favCount = docs.length;

                if(docs.length > 0 && typeof req.user !== "undefined")
                {
                    docs.forEach(function(favorite) {

                        if(favorite.userID == req.user._id)
                        {
                            obj.fav = 1;
                            return false;
                        }
                    });
                }

                var query = UserModel.findOne(mongoose.Types.ObjectId(announce.userID));

                query.exec(function (err, userName) {

                    obj.name = (typeof userName.facebook.name!=="undefined"?userName.facebook.name:typeof userName.twitter.username !== "undefined"?userName.twitter.username:typeof userName.google.name !== "undefined"?userName.google.name:userName.local.username); // TODO Email
                    obj.source = (typeof userName.facebook.name!=="undefined"?1:typeof userName.twitter.username!=="undefined"?2:typeof userName.google.name !== "undefined"?3:4);

                    if(typeof req.user !== "undefined")
                    {
                        if(req.user._id ==announce.userID)
                        {
                            obj.name = "Ich";
                        }
                    }

                    announcements.push(obj);

                    var title= 'Pencilbox | Locale Nachricht';

                    res.render('news', { title: title, ancmts: announcements,lat:announce.lat, lng:announce.lng, username: username, userID: userID, announceID:announceID, about:about});
                });
            });
        });

};

function timeConverter(timestamp){
    var a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ';// + year+' ' + hour + ':' + min + ':' + sec ;
    return time;
}