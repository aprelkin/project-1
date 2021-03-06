
/**
 * Module dependencies.
 */

var express = require('express')
    , board = require('./routes/board')
    , places = require('./routes/places')
    , impressum = require('./routes/impressum')
    , login = require('./routes/login')
    , announce = require('./routes/announce')
    , news = require('./routes/news')
    , fav = require('./routes/fav')
    , http = require('http')
    , path = require('path')
    , fs = require('fs')
    , gm = require('gm')
    , mongoose = require('mongoose')
    , database = require('./config/database')
    , passport = require('passport')
    , flash = require('connect-flash')
    , siteMap = require('./routes/siteMap')
    , googleAccept = require('./routes/googleAccept')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , session= require('express-session')
    , logger = require('morgan')
    , methodOverride = require('method-override')
    , favicon = require('serve-favicon')
    , multer  = require('multer')
    , upload = multer({ dest: __dirname + '/public/images/tmp/' })
    , app = express();

// all environments
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname+'/public/stylesheets/favicon/favicon.ico'));

app.enable('strict routing');
require('./config/passport')(passport); // pass passport for configuration

// localization
var i18n = require('i18n');
i18n.configure({

    //define how many languages we would support in our application
    locales:['en', 'de', 'ru', 'es' ],

    //define the path to language json files, default is /locales
    directory: __dirname + '/locales',

    //define the default language
    defaultLocale: 'en',

    // define a custom cookie name to parse locale settings from
    cookie: 'i18n'
});

app.use(cookieParser("i18n_demo")); // read cookies (needed for auth)

app.use(session({
    secret: "i18n_demo", // must have the same secret as cookieParser (above)
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

//init i18n (must be after cookie-parser)
app.use(i18n.init);

mongoose.connect(database.url); // connect to our database

// development only
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

    app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
                message: err.message,
                error: {}
          });
    });



// clear cache browser back solution
app.get('/*',function(req,res,next){

  res.header('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');

  if (req.headers.host.match(/^www\./)){
    res.redirect(301, 'http://pencilbox.io');
  }else{
    return next();
  }
});

app.post('/signin',
    passport.authenticate('local-signin', { successRedirect: '/login',
      failureRedirect: '/login',
      failureFlash: true })
);

app.post('/signup',
    passport.authenticate('local-signup', { successRedirect: '/login',
      failureRedirect: '/login',
      failureFlash: true })
);

// i18n: put locale id into the cookie and redirect
app.get('/ru', function (req, res) {
    res.cookie('i18n', 'ru');
    res.redirect('/')
});

app.get('/en', function (req, res) {
    res.cookie('i18n', 'en');
    res.redirect('/')
});

app.get('/de', function (req, res) {
    res.cookie('i18n', 'de');
    res.redirect('/')
});

app.get('/es', function (req, res) {
    res.cookie('i18n', 'es');
    res.redirect('/')
});

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));

// =====================================
// FACEBOOK ROUTES ======================
// =====================================

// send to facebook to do the authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));

// =====================================
// GOOGLE ROUTES ======================
// =====================================

// send to google to do the authentication
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));


app.get('/',  announce.init);

app.post('/look',announce.find);

app.get('/showMessages', announce.showMessages);

app.post('/showMyFavarites', fav.showMyFavarites);

app.post('/save',upload.array('img', 12), announce.save, places.save);

app.get('/put', board.index);

app.get('/places', places.index, announce.count);

app.post('/savePlace', places.save);

app.post('/deletePlace', places.delete);

app.post('/findPlace', places.find);

app.get('/impressum',impressum.index);

app.get('/login', login.index);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/typeahead', announce.typeahead);

app.post('/delete', announce.delete);

app.post('/update', announce.update);

app.post('/fav', fav.update);

app.get('/news', news.index);

app.post('/findByUserId', announce.findByUserId);

app.post('/findByAddress', announce.findByAddress);

// siteMap
app.get('/sitemap.xml', siteMap.index);

//google verification for gmail service
app.get('/googleb7cf716048a384e5.html', googleAccept.index);

module.exports = app;



