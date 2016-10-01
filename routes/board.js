
/*
 * GET Pinboard page.
 */

exports.index = function(req, res){

    if (typeof req.user !== "undefined") {

        var lat = req.param('lat');
        var lng = req.param('lng');

        res.render('board', { title: 'Nachricht schreiben', lat: lat, lng:lng});
    }
    else
    {
        res.render('board', { title: 'Nachricht schreiben'});
        res.redirect('/login');
    }
};