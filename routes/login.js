
/*
 * GET Pencilbox page.
 */

var UserModel = require('../models/userModel');


exports.index = function(req, res){

    var status = parseInt(req.flash('status'));
    var username = req.flash('username');
    var email = req.flash('email');
    var message = "";

    console.dir(req.user);


    if (typeof req.param('userid') !== "undefined") {

        var userid = req.param('userid');

        UserModel.findById(userid, function(err, user) {

            if (err)
            {
                console.log("user not defined for activation");
            }

            if (user)
            {
                user.local.confirmed = true;
                user.save(function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        status = 8;
                        message = "Du kanst jetzt dich Anmelden";

                        res.render('login', { title: 'Anmelden', message: message, status: status, username: username, email:email});
                    }
                });
            }
            else
            {
                status = 9;
                message = "Benutzer wurde nicht gefunden";

                res.render('login', { title: 'Anmelden', message: message, status: status, username: username, email:email});
            }
        } );

    }
    else
    {
        if(isNaN(status))
        {
            status = 0;
        }
        if(status == 1)
        {
            message = "E-Mail Adresse wurde nicht gefunden, neuer Versuch?";
        }
        if(status == 2)
        {
            message = "Das Password ist definitiv falsch";
        }
        if(status == 3)
        {
            if (typeof req.user !== "undefined") {
                message = "@" +req.user.local.username + " "+"willkommen bei Pencilbox.de"
            }
        }
        if(status == 4)
        {
            message = "E-Mail Adresse oder Benutzer existiert bereits";
        }
        if(status == 5)
        {
            message = "Eine Bestätigungsmail wurde an "+ email+ " gesendet";
        }
        if(status == 6)
        {
            message = "Bitte bestätigen Sie Ihre E-Mail Adresse";
        }
        if(status == 7)
        {
            message = "Benutzer is nicht mehr aktive";
        }

        res.render('login', { title: 'Anmelden', message: message, status: status, username: username, email:email});
    }
};