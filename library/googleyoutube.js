var fs = require('fs');
var _ = require('underscore');
var google = require('googleapis');
var youtube = google.youtube('v3');
var config = require('../config/googleyoutube');
var utility = require('../constant/utility');
var OAuth2 = google.auth.OAuth2;
var oauth2Client;
var filepath = config.token_dir_path+config.token_file;

var googleyoutube = function(){
	this.oauth2Client = new OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);	
};

googleyoutube.prototype.getAuthUrl = function(){
	var options = {'scope':config.scope,'access_type':'offline','approval_prompt':'force','response_type':'code'};
   	return this.oauth2Client.generateAuthUrl(options);
};

googleyoutube.prototype.getToken = function(code){
	this.oauth2Client.getToken(code, function(err, tokens) {
		if (err) {
			console.log('Error while trying to retrieve access token', err);
			return;
		}		
		if(_.size(tokens) > 0){
		  	if (!fs.existsSync(config.token_dir_path)) {
		  		//create directory to store token
		  		utility.create_dir(config.token_dir_path,function(err,res){
		      		if(err){ 
		      			console.error('Error while tring to create directory',err); 
		      		}
		      	});
		  	}
		  	utility.writeFile(filepath, JSON.stringify(tokens));	      
	    }	    	    
		return tokens;
	});
};

googleyoutube.prototype.isTokenExists = function(){	
	if(utility.fileExists(filepath)){		
		var token = this.fetchTokenFromFile();		
		if(!_.isUndefined(tokens.access_token) && !_.isEmpty(tokens.access_token)){
			return true;
		}
	}
	return false;
};

googleyoutube.prototype.fetchTokenFromFile = function(){
	var tokens = utility.readFile(filepath);
	tokens = JSON.parse(tokens);
	return tokens;
};

googleyoutube.prototype.refreshToken = function(tokens,callback){
	var isTokenExpired = false;
	
	if(_.size(tokens) > 0){		
		var expiryDate = tokens.expiry_date;
		isTokenExpired = expiryDate ? expiryDate <= (new Date()).getTime() : false;	
	}

	if(!isTokenExpired){
		callback(null,tokens);
		return false;
	}
	
	this.oauth2Client.setCredentials(tokens);
	this.oauth2Client.refreshAccessToken(function(err, tokens) {
		if(!err){
			if(_.size(tokens) > 0){
			  	if (!fs.existsSync(config.token_dir_path)) {
			  		//create directory to store token
			  		utility.create_dir(config.token_dir_path,function(err,res){
			      		if(err){ 
			      			console.error('Error while tring to create directory',err); 
			      		}
			      	});
			  	}
			  	
			  	utility.writeFile(filepath, JSON.stringify(tokens));	      
		    }	    	    
			callback(null,tokens);
			return tokens;
		}else{
			console.log('Error while trying to get refresh token', err);
			callback(err,null);
			return false;
		}
        
	});
};

googleyoutube.prototype.uploadVideo = function(options,callback){
	var tokens = this.fetchTokenFromFile();	
	var that = this;

	this.refreshToken(tokens,function(err,tokens){
		if(!err){
			that.oauth2Client.setCredentials(tokens);
			options.part = (_.isEmpty(options.part)) ? 'status,snippet' : options.part;
			youtube.videos.insert({
		        auth: that.oauth2Client,
		        part: options.part,
		        resource: {
		                snippet: {
		                    title: options.title,
		                    description: options.description
		                },
		                status: {
		                    privacyStatus: options.privacyStatus //if you want the video to be private/public
		                }
		        },
		        media: {
		                body: fs.createReadStream(options.videofile)
		        }
		    },function(err,resp){
		    	if(err){
		    		callback(err,null);	
		    	}else{
		    		callback(null,resp);
		    	}
		    });
		}		
	});
};

module.exports = googleyoutube;