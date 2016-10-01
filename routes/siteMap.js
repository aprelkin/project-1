
var mongoose = require('mongoose');
var sm = require('sitemap')
var AnnounceModel = require('../models/announceModel');


exports.index = function(req, res){

    sitemap = sm.createSitemap ({
        hostname: 'http://pencilbox.de',
        cacheTime: 600000
    })

    AnnounceModel.find({}, function (err, result){
        if(err||!result) console.log("links for sitemap is not found")
        else result.forEach(function(doc){
            sitemap.add({url: '/news?id='+doc._id});
        });

        sitemap.toXML( function (xml) {
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
   });
}