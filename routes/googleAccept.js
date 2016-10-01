/**
 * Created by dmitry on 13.02.2016.
 */

exports.index = function(req, res){

    res.render('googleAccept', { code: 'google-site-verification: googleb7cf716048a384e5.html' });
};