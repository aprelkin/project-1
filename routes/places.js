
/*
 * GET Pencilbox.io page.
 */

var PlaceModel = require('../models/placeModel');
var mongoose = require('mongoose');


exports.index = function(req, res){

    if (typeof req.user !== "undefined") {

        var userid = String(mongoose.Types.ObjectId(req.user._id));

        var userIds = [];
        userIds.push(userid);

        PlaceModel.find({userIds:{"$in":userIds}}, function (err, docs) {

            console.log(docs);

            res.render('places', { places:docs });
        });
    }
    else
    {
        res.redirect('/login');
    }
};

exports.save = function(req, res){

    if (typeof req.user !== "undefined") {

        var action = JSON.parse(req.body.action);
        var lat = req.body.lat;
        var lng = req.body.lng;
        var address = req.body.address;
        var radius = req.body.radius;
        var userid = String(mongoose.Types.ObjectId(req.user._id));
        var state = (req.body.state === 'true');

        PlaceModel.findOne({tags:{"$in":[action]}, lat:lat, lng:lng, radius:radius}, function (err, doc) {

            if(doc != null)
            {
                var index = doc.userIds.indexOf(userid);
                
                if(index < 0 && state)
                {
                    doc.userIds.push(userid);
                    doc.save(function(err) {
                        if (err)
                            console.log('error')
                        else
                            console.log('success')
                    });
                }
                else if(!state)
                {
                    // in case unfollow remove person from this place
                    doc.userIds.splice(index, 1);

                    doc.save(function(err) {
                        if (err)
                            console.log('error')
                        else
                            console.log('success')
                    });
                }
            }
            else if(state)
            {
                var userIds = [];
                userIds.push(userid);
                var newPlace = new PlaceModel({
                    userIds:userIds,
                    tags:action,
                    lat:lat,
                    lng:lng,
                    address:address,
                    radius: radius
                });

                newPlace.save(function(err, saved) {
                    if( err || !saved ) console.log("Image not saved"+ err);
                    else console.log("Place saved");
                });

            }
        });

        res.sendStatus(200);
    }
    else
    {
        res.redirect('/login');
    }
};

exports.delete = function(req, res)
{
    if(typeof req.user !== "undefined")
    {
        var place_id = req.body.place_id;
        var userid = String(mongoose.Types.ObjectId(req.user._id));
        
        PlaceModel.findOne({_id:place_id}, function (err, doc) {

            if(doc != null)
            {
                // in case unfollow remove person from this place
                doc.userIds.splice(userid, 1);

                doc.save(function(err) {
                    if (err)
                        console.log('error')
                    else
                        console.log('success')
                });

                res.sendStatus(200);
            }
            else {
                res.sendStatus(900);
            }
        });

        
    }
}

exports.find = function(req, res){

    if (typeof req.user !== "undefined") {
        
        var action = JSON.parse(req.body.action);
        var lat = req.body.lat;
        var lng = req.body.lng;
        var radius = req.body.radius;
        var userid = String(mongoose.Types.ObjectId(req.user._id));

        var userIds = [];
        userIds.push(userid);

        PlaceModel.findOne({userIds:{"$in":userIds}, tags:{"$in":[action]}, lat:lat, lng:lng, radius:radius}, function (err, doc) {

            if(doc != null)
            {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(900);
            }
        });
    }
    else
    {
        res.sendStatus(900);
    }
};