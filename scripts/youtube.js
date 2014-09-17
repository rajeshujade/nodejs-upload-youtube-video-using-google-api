var _ = require('underscore');
var fs = require('fs');
var mime = require('mime');
var config = require('../config/googleyoutube');
var youtube = require('../library/googleyoutube');
var youtube = new youtube();
fs.readdir(config.video_dir_path,function(err,fileArr){	
	if(err){
		console.log('Error while retrieving video directory',err);
	}else{
		_.each(fileArr,function(file,key){
			file = config.video_dir_path+file;
			var mimeType = mime.lookup(file);
			if(mimeType.indexOf("video/") === 0){
				var options = {
					"title":"Script upload video",
					"description": "Script upload Video Description",
					"privacyStatus": "private",
					"videofile": file
				};
				youtube.uploadVideo(options,function(err,res){
					if(err){
						console.log('Error while uploading video',err);
					}else{
						console.log('\n Video has been successfully uploaded \n',res);
						console.log('\n Check your uploaded video using:\n https://www.youtube.com/watch?v='+res.id);
					}
				});
			}
		});
	}
});