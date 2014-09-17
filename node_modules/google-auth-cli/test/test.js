var gauth = require('../lib'),
	googleapis = require('googleapis'),
	assert = require('chai').assert;

describe('gauth test', function() {
	it('test auth', function(done) {
		this.timeout(50000);
		googleapis
			.discover('plus', 'v1')
			.execute(function(err, client) {
				if (err) return done(err);
				gauth({
					access_type: 'offline', // will return a refresh token
					scope: 'https://www.googleapis.com/auth/plus.me'
				}, {
					// the client key you applied in https://code.google.com/apis/console
					// the redirect url should be localhost, and your should provide a port, if not default use 80
					client_id: "<the client id>",
					client_secret: "<client secret>",
					port: 8080,
					timeout: 5000, // in seconds
				}, function(err, authClient, tokens) {
					if (err) return done(err);
					console.log(tokens); // tokens with access_code and refresh_code
					client
						.plus.people.get({
							userId: "me"
						})
						.withAuthClient(authClient) // authClient now can be used
					.execute(function(err, profile) {
						console.log(profile, err);
						done(err);
					});
				});
			});
	});
});