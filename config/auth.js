// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID' 		: '258669987671640', // your App ID
        'clientSecret' 	: '4dba0b143240f283305f7fd0d3ecd1b7', // your App Secret
        'callbackURL' 	: 'http://pencilbox.io/auth/facebook/callback'
    },

	'twitterAuth' : {
		'consumerKey' 		: 'rrDHsYbxRubRePvL5dlsz48q2',
		'consumerSecret' 	: 'khPrEcrnME7sVJcenELLWmxaN6HVXGYsZYaQgsrO7BOHmvEFUX',
		'callbackURL' 		: 'http://pencilbox.io/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '291523349662-fk95i65frnsilbjuabqjd9g7i2mp74vc.apps.googleusercontent.com',
		'clientSecret' 	: 'XEoVZjRHW9YiwDfO2w9j9ab9',
		'callbackURL' 	: 'http://pencilbox.io/auth/google/callback'
	}

};