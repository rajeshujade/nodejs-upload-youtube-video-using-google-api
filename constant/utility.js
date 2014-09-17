var fs = require('fs');
var mkdirp = require('mkdirp');

exports.create_dir = function(path){
	mkdirp(path, function (err) {
		if (err){
			console.error('Error while tring to create directory',err);
		}else{
			return true;
		} 
	});
	return false;
};

exports.writeFile = function(filepath,string){
	var wstream = fs.createWriteStream(filepath);
	wstream.on('finish', function () {
	  console.log('token file has been written');
	});
	wstream.write(string);
	wstream.end(function () { console.log('writing token file end'); });
	return true;
};

exports.fileExists = function(filepath){
	if (fs.existsSync(filepath) === true) {
		return true;
	}
	return false;
};

exports.readFile = function(filepath){
	var data = fs.readFileSync(filepath, "utf8", function (error) {		
		if(error){
			return false;
		}
    });
	return data;
};