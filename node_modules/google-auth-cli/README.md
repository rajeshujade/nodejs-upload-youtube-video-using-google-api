# Google Authentication From Command Line

When build command line tools, it's not very convinient for user to copy link and go to browser, then paste the authroization code to the terminal. This authentication process is not user freindly for command line tools.

This module will try to open browser and let user make decision whether grant the authorization or not, and the authorization code will be returned back to your program.

It based on project [google-api-nodejs-client](https://github.com/google/google-api-nodejs-client)

## Usage

see [test/test.js](test/test.js) in repository.
 
```javascript

	gauth({ // scopes
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
   			}).withAuthClient(authClient) // authClient now can be used
     		.execute(function(err, profile) {
     			console.log(profile, err);
     			done(err);
   			});
   	});

```


## License

(The MIT License)

    Copyright (c) 2014, Villa.Gao <jky239@gmail.com>;
    All rights reserved.

