
/*
 * GET Pinboard page.
 */
var mongoose = require('mongoose');
var FavModel = require('../models/favModel');
var AnnounceModel = require('../models/announceModel');
var UserModel = require('../models/userModel');

exports.showMyFavarites = function(req, res){

    if(typeof req.user !== "undefined")
    {
        var announcements = new Array();

        FavModel.find({userID: req.user._id}, function (err, result) {

            if (err) console.log("Favs not found" + err);

            function getAnnounces(i)
            {
                if( i < result.length) {
                    var query = AnnounceModel.findOne(mongoose.Types.ObjectId(result[i].announceID));

                    query.exec(function (err, announce) {

                            if (err) console.log("Announce not found" + err);

                            var obj = {};
                            obj.time = timeConverter(announce.timeStamp);
                            obj.rest = announce;
                            obj.fav = 1;

                        FavModel.find({announceID:result[i].announceID}, function (err, docs) {

                                if (err) console.log("Favs not found"+ err);

                                obj.favCount = docs.length;

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
                                    getAnnounces(i + 1);
                                });

                            }
                        );
                    });
                }
                else
                {
                    res.send(announcements);
                }
            }

            getAnnounces(0);
        });

    }
    else
    {

    }
};


exports.update = function(req, res) {

    if(typeof req.user === "undefined")
    {
        res.send(200);
    }
    else
    {
        FavModel.findOne({userID: req.user._id, announceID: req.body.announceid}, function (err, doc) {

            if (err) console.log("Fav not found" + err);

            if (doc == null) {
                var newFav = new FavModel({
                    userID: req.user._id,
                    announceID: req.body.announceid
                });

                newFav.save(function (err, saved) {
                    if (err || !saved) console.log("Fav not saved" + err);
                    else console.log("Fav saved");

                    FavModel.find({announceID: req.body.announceid}, function (err, docs) {

                        if (err) console.log("Favs not found" + err);

                        var answer = [];
                        answer.push({"status": 1});
                        answer.push({"size": docs.length});
                        answer.push({"announceID": req.body.announceid});
                        res.json(answer);
                    });
                });
            }
            else {
                doc.remove();
                console.log("doc removed");

                FavModel.find({announceID: req.body.announceid}, function (err, docs) {

                    if (err) console.log("Favs not found" + err);

                    var answer = [];
                    answer.push({"status": 0});
                    answer.push({"size": docs.length});
                    answer.push({"announceID": req.body.announceid});
                    res.json(answer);
                });
            }
        });
    }
}

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