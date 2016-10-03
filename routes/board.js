
/*
 * GET Pinboard page.
 */

exports.index = function(req, res){

    if (typeof req.user !== "undefined") {

        var lat = req.query.lat;
        var lng = req.query.lng;

        res.render('board', { title: 'Nachricht schreiben', lat: lat, lng:lng});
    }
    else
    {
        res.redirect('/login');
    }
};