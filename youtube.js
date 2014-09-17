var google = require('googleapis');
var fs = require('fs');
var youtube = google.youtube('v3');
var authClient = new google.auth.JWT(
'531752385027-77p9l74s0jgbiqem3hr9ed21vus5vkgv@developer.gserviceaccount.com',
'youtube.pem',
null,
['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.upload'],
null
);



authClient.authorize(function(err, tokens) {
if (err) {
	console.log(err);
	return;
}
 var oauth2Client = new google.auth.OAuth2('531752385027-l0noole3503k1mcs9ua6f8rcbe6r243a.apps.googleusercontent.com', 'AIzaSyCaRPSb1GLoaojAqNhnyddv-C8afGl7Wnk', 'http://googlecodeigniter.com/');
    oauth2Client.setCredentials(tokens);
    google.options({auth: oauth2Client});
	youtube.videos.insert({
		auth: authClient,
		part: 'status,snippet',
		resource: {
            		snippet: {
                		title: "First Video",
                		description: "First Video Description"
            		},
            		status: { 
                		privacyStatus: 'private' //if you want the video to be private
            		}
        	},
		media: {
            		body: fs.createReadStream('./youtube.3gp')
        	}
	},function(err,resp){
		console.log(err);
		console.log(resp);
	});
	/*youtube.videos.insert({auth:authClient,part:'snippet,status,contentDetails'},function(err,resp){
		console.log(err);
		console.log(resp);
	});*/
	/*youtube.videos.list({auth:authClient,part:'snippet',chart:'mostPopular'}, function(err, resp) {
		console.log(resp);
		console.log(err);
	});*/
	//console.log(tokens);
});
