var readline = require('readline'),
	url = require('url'),
	http = require('http'),
	path = require('path'),
	colors = require('colors'),
	querystring = require('querystring'),
	open = require('open'),
	fs = require('fs'),
	googleapis = require('googleapis'),
	OAuth2Client = googleapis.OAuth2Client;

// Client ID and client secret are available at
// https://code.google.com/apis/console
var TIMEOUT = 5 * 60 * 1000,
	oauth2Client;

module.exports = function(scopes, options, callback) {

	var client_secret = options.client_secret,
		client_id = options.client_id,
		timeout = options.timeout || TIMEOUT,
		html = options.html || "<html><head><title>Success</title></head><body><h1>SUCCESS</h1><span>Authencation success</span>\
		<p> You can close this window and go back to the terminal</p></body></html>",
		port = options.port || 80,
		timeouted = false;

	if (!client_id || !client_secret)
		callback(new Error("Client_Id or Client_Secret must be provided.", module.__filename__));


	var redirect_url = options.port ? ('http://localhost:' + port + '/') : 'http://localhost';

	oauth2Client = oauth2Client ||
		new OAuth2Client(client_id, client_secret, redirect_url);

	// Get access code
	// start sever for redirect
	var codeServer = http.createServer(function(req, res) {
		var code = querystring.parse(url.parse(req.url).query).code
		res.writeHead(200, {
			"Content-Type": "text/html",
			'Connection': 'close'
		});

		res.write(html);
		res.end();

		process.nextTick(function() {
			codeServer.close();

			if (!timeouted) {
				// request access token
				oauth2Client.getToken(code, function(err, tokens) {
					// set tokens to the client
					oauth2Client.setCredentials(tokens);
					return callback(null, oauth2Client, tokens);
				});
			}
		});
	});

	codeServer.maxConnections = 1;
	codeServer.listen(port);

	// generate consent page url
	var grantUrl = oauth2Client.generateAuthUrl(scopes);

	console.log('Visit the url to get tokens: ', grantUrl);

	open(grantUrl);
	setTimeout(function() {
		callback && callback(new Error("Timeout"));
		timeouted = true;
	}, timeout);
};