
// Email setup

var nodemailer = require("nodemailer");

var AuthMailModel = require('../models/authMailModel');

var generator = require('xoauth2').createXOAuth2Generator({
    user: 'info@pencilbox.de',
    clientId: '90505732878-limm1ivj1qf7jicuec7qseuk8suas0gg.apps.googleusercontent.com',
    clientSecret: '_fvG8zEPimyRX2hiFoMP5HXO',
    refreshToken: '1/QXEcjuqwfHEWjSAzDQFHesJpJMZHqQBNGHjPWb7HaYY',
    accessToken: 'ya29.jwIX0_bKgMbK1CgqQlfKmVxDBpPWgDtDGzOwd-RtzFhOhxR1qNiKRSB8kutgU50t8EGv' // optional
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// create reusable transport method (opens pool of SMTP connections)

exports.activate = function(id, name, email){

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "info@pencilbox.de", // sender address
        subject: "Please Comfirm Registration", // Subject line
        html: "<b><a href='pencilbox.de/login'> link </a>  </b>" // html body
    }

    // login
    var transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    }));


    // TODO FIX TO REAL MAIL!!!

    var transporter = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "varlamov.dimitry@gmail.com",
            pass: "1Qwar2014"
        }
    });

    //var transporter = nodemailer.createTransport('smtps://info@pencilbox.de:1Qwar2016@smtp.gmail.com');

    mailOptions.html="Bitte bestätigen Sie Ihre Anmeldung durch einen Klick auf folgenden Link: </br><b><a href='pencilbox.de/login?userid="+id+"'>pencilbox.de/login?userid="+id+"</a></b><br><br>" +
                     "Nach der Bestätigung erhalten Sie die Zugangsdaten zu Ihrem Account.<br><br>Ihr <b><a href='pencilbox.de'>Pencilbox</a></b> Team";
    mailOptions.to = email;

    // send mail with defined transport object

    // Save Email from Authorisation
    var newAuthMailModel = new AuthMailModel({
        id: id,
        username: name,
        email: email,
        success: true
    });

    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            newAuthMailModel.success = false;
        }else{
            console.log("Message sent: " + response.message);
            newAuthMailModel.success = true;
        }

        newAuthMailModel.save(function(err, saved) {
            if( err || !saved ) console.log("Auth Email not saved"+ err);
            else console.log("Auth Email saved");
        });
    });
    transporter.close();
};

