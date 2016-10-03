
var mongoose = require('mongoose');
var gm = require('gm');
var fs = require('fs');

var AnnounceModel = require('../models/announceModel');
var ImgMapModel = require('../models/imgMapModel');
var UserModel = require('../models/userModel');
var InputTagModel = require('../models/inputTagModel');
var FavModel = require('../models/favModel');
var maxmind = require('maxmind'); // maxmind@1


var path = require('path');
var appDir = path.dirname(require.main.filename);
var cityLookup = maxmind.open('public/geoip/GeoLite2-City.mmdb');


exports.init = function(req, res){

    var username = "";

    if (typeof req.user !== "undefined") {

        if(typeof req.user.local.username !== "undefined")
        {
           console.log("local");
           username = req.user.local.username;
        }
        if(typeof req.user.twitter.username !== "undefined")
        {
            console.log("twitter");
            username = "@"+req.user.twitter.username;
        }
        if(typeof req.user.facebook.name !== "undefined")
        {
            console.log("facebook");
            username = req.user.facebook.name;
        }
        if(typeof req.user.google.name !== "undefined")
        {
            console.log("google");
            username = req.user.google.name;
        }
    }

    // https://github.com/runk/node-maxmind  (curent 1.2.25)
    //console.log(location); test

    var cityObject = cityLookup.get(req.connection.remoteAddress);

    if(cityObject == null) {

        cityObject = cityLookup.get("66.6.44.4"); // NY
    }

    res.render('index', { title: 'Pencilbox', town: cityObject['city'].names['en'],  lat: cityObject['location'].latitude, lng: cityObject['location'].longitude, username:username });
};


exports.find = function(req, res){

    var action = JSON.parse(req.body.action);

    var actObj = [];

    for(var i= 0; i < action.length; i++)
    {
        actObj.push({action:action[i]});
    }

    var announcements = new Array();

    AnnounceModel.where('loc').within({ center: [ parseFloat(req.body.lat), parseFloat(req.body.lng)], radius: req.body.radius / 6371, unique: true, spherical: true }).find({ $and: actObj}).skip(parseInt(req.body.skip)).limit(10).exec(
        function(err, result) {
        if( err || !result) console.log("Announcement not found");

        else
        {
            if(result.length == 0)
            {
                getAllAnnouncements(req,res);
            }
            else
            {
                var isAll = false;
                getAnnouncements(0,req, res, result, announcements, isAll);
            }
        }
    });
};

/**
 * Function save announcement
 * @param req
 * @param res
 */

exports.save = function(req, res){

    var maxinputtaglength = 30;
    var announcementID = mongoose.Types.ObjectId();
    var timeStamp = announcementID.getTimestamp();
    var userid = req.user._id;
    var announcement = req.body.announcement;
    var position = req.body.position;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var imgLength = 0;
    var address = req.body.address;

    var action = JSON.parse(req.body.action);

    var imgs = [];

    for (var i =0; i < action.length; i++)
    {
        action[i] = action[i].toLowerCase();
    }

    action.splice(maxinputtaglength);

    if(typeof req.files.img !== "undefined" )
    {
        if(typeof req.files.img.length === "undefined")
        {
            var split = req.files.img.name.split(".");
            var ext = split[split.length-1];
            var name = announcementID.toString()+'_'+ 'pic'+'_'+0+'.'+ext.toLowerCase();

            imgs.push(name);

            var oldPath = req.files.img.path;
            var newPath = appDir+'/public/images/'+name;
            var gmPath = appDir+ '/public/images/mini/'+name;

            fs.renameSync(oldPath, newPath);

            gm(newPath)
                .resize(null, 431)
                .noProfile()
                .write(gmPath, function (err) {
                    if (err){console.log(err)}
                });

            var newImgMapModel = new ImgMapModel({
                name:name,
                announcementID: announcementID.toString()
               });

            newImgMapModel.save(function(err, saved) {
                if( err || !saved ) console.log("Image not saved"+ err);
                else console.log("Image saved");
            });

            imgLength = 1;
        }
        else
        {
            imgLength = req.files.img.length;
            for(var i= 0; i < req.files.img.length; i++ )
            {
                var split = req.files.img[i].name.split(".");
                var ext = split[split.length-1];
                var name = announcementID.toString()+'_'+ 'pic'+'_'+i+'.'+ext.toLowerCase();

                imgs.push(name);

                var oldPath = req.files.img[i].path;
                var newPath = appDir + '/public/images/'+name;
                var gmPath = appDir + '/public/images/mini/'+name;
                fs.renameSync(oldPath, newPath);

                gm(newPath)
                    .resize(null, 431)
                    .noProfile()
                    .write(gmPath, function (err) {
                        if (!err)
                        {
                            console.log('done')
                        }
                        else
                        {
                            console.log(err);
                        }
                    });

                var newImgMapModel = new ImgMapModel({
                    name:name,
                    announcementID: announcementID.toString()
                });

                newImgMapModel.save(function(err, saved) {
                    if( err || !saved ) console.log("Image not saved"+ err);
                    else console.log("Image saved");
                });

            }
        }
    }

    var newAnnouncement = new AnnounceModel({
            _id:announcementID.toString(),
            loc:[parseFloat(lat), parseFloat(lng)],
            userID: userid,
            announcement: announcement,
            lat:lat,
            lng:lng,
            imgLength: imgLength,
            imgs :imgs,
            address : address,
            action: action,
            timeStamp: timeStamp
        });

    newAnnouncement.save(function(err, saved) {
        if( err || !saved ) console.log("Annoucement not saved"+ err);
        else console.log("Announcement saved");
        res.send(200);
    });


    function checkInputTag(i) {
        if( i < action.length ) {

            console.log("Tag : "+action[i]);

            var inputTagQuery  = InputTagModel.where({ name: action[i].toLowerCase() });

            inputTagQuery.findOne(function (err, inputTag) {

                if( err) console.log("Tag not is not found"+ err);

                if (inputTag)
                {
                    console.log("Tag is found");
                    checkInputTag(i+1);
                }
                else
                {
                    console.log("Tag not found");
                    var newInputTag = new InputTagModel({
                        name: action[i].toLowerCase()
                    });

                    newInputTag.save(function(err, saved) {
                        if( err || !saved ) console.log("new InputTag not saved"+ err);
                        else checkInputTag(i+1);
                    });
                }
            });
        }
    }
    checkInputTag(0);
};

exports.delete = function(req,res)
{
    AnnounceModel.findOne({_id: mongoose.Types.ObjectId(req.body.announceid)}, function(err, announcement){

        if(req.user._id == announcement.userID)
        {
            console.log("delete");

            AnnounceModel.remove({_id: mongoose.Types.ObjectId(req.body.announceid)},function(){

                console.log("announcement removed");

                res.send(200);
            });
        }
        else
        {
            console.log("users not equal");
        }
    });
}

exports.update = function(req,res)
{
    console.log("update announce : id "+req.body.announceid  +  " text: "+req.body.text);

    AnnounceModel.findOne({_id: mongoose.Types.ObjectId(req.body.announceid)}, function(err, announcement){

        if(req.user._id == announcement.userID)
        {
            console.log("update");
            
            announcement.announcement = req.body.text;

            announcement.save(function(err) {
                if (err)
                    console.log('error')
                else
                    console.log('success')
            });
        }
        else
        {
            console.log("users not equal");
        }
    });
}



exports.typeahead = function(req, res){

    var tags = [];

    InputTagModel.find({name: new RegExp('^'+req.query.query.toLowerCase())}).sort({name: 1}).limit(5).exec(function(err, inputTags) {

        if (err) console.log("InputTag not is found"+ err);

        inputTags.forEach(function(tag){
            tags.push({word : tag.name});
        });

        res.json(tags);
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


/**
 * Function return all announcements
 * @param req
 * @param res
 */

function getAllAnnouncements(req, res)
{
    var announcements = new Array();

    AnnounceModel.find().skip(parseInt(req.body.skip)).limit(100).exec(
        function(err, result) {
            if( err || !result) console.log("Announcement not found");

            else {
                var index = 0;
                var isAll = true;
                getAnnouncements(index,req, res, result, announcements, isAll)
            }
        });
}

/**
 * Function return an announcements array
 * @param i
 * @param req
 * @param res
 * @param result
 * @param announcements
 */

function getAnnouncements(i, req, res, result, announcements, isAll)
{
    if( i < result.length)
    {
        var query = UserModel.findOne(mongoose.Types.ObjectId(result[i].userID));

        query.exec(function(err, userName) {
            if (err) {
                console.log("err!!!");
            }

            FavModel.findOne({ userID: (typeof req.user !== "undefined"?req.user._id:0), announceID:result[i]._id}, function (err, doc) {

                if (err) console.log("Fav not found" + err);

                var obj = {};

                obj.name = (typeof userName.facebook.name!=="undefined"?userName.facebook.name:typeof userName.twitter.username !== "undefined"?userName.twitter.username:typeof userName.google.name !== "undefined"?userName.google.name:userName.local.username); // TODO Email

                if(typeof req.user !== "undefined")
                {
                    if(req.user._id ==result[i].userID)
                    {
                        obj.name = "Ich";
                    }
                }
                obj.source = (typeof userName.facebook.name!=="undefined"?1:typeof userName.twitter.username!=="undefined"?2:typeof userName.google.name !== "undefined"?3:4);
                obj.time = timeConverter(result[i].timeStamp);
                obj.rest = result[i];
                obj.fav = 0;
                obj.isAllannouncements = isAll;

                if(doc != null)
                {
                    obj.fav = 1;
                }

                FavModel.find({announceID:result[i]._id }, function (err, docs){

                    if (err) console.log("Favs not found"+ err);


                    obj.favCount = docs.length;

                    announcements.push(obj);
                    getAnnouncements(i+1, req, res, result, announcements, isAll);
                });
            });
        });
    }
    else
    {
        res.send(announcements);
    }
}


