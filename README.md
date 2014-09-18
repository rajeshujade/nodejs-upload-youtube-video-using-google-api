# README #

Upload video to youtube using Google APIs Node.js Client with express.


### Purpose ###

Youtube is not allowing to upload a video using OAuth 2.0 Service Account. This library will help to upload a server to server video using OAuth 2.0 authentication. It needs to take offline & upload video to youtube permission only one time. After that it will save the credentials in files system & use the same to upload all video from videos directory using background process like cronjob.

### Dependecies ###
```
"express": "~4.8.6",
"ejs": "~0.8.5",
"mime": "^1.2.11",
"googleapis": "^1.0.12",
"underscore": "^1.7.0"
```
#Direct Installation#

- In the root directory nginx configuration file is provided. Copy this file in nginx config folder and restart the server.
- Change the google api configuration options in `vim config/googleyoutube.json` 

```
{
  "CLIENT_ID"      : "", # add application google client id
  "CLIENT_SECRET"  : "", # application goolge client secret
  "REDIRECT_URL"   : "http://example.com/", #change the host
  "scope"          : ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.upload"],
  "token_dir_path" : "/tmp/googleyoutube/",
  "token_file"     : "token.txt",
  "video_dir_path" : "pathtoapplication/videos/"
}
```
- Add host entry for example.com
- Run node web application - 
```
cd nodejs-upload-youtube-video-using-google-api
DEBUG=* && npm start
```
- Authorized the application using web based OAuth 2.0
- Added video in `videos/` directory.
- Run the node backend script `node scripts/youtube.js`. This scripts takes video(s) from `videos/` directory
- Check uploaded video on youtube https://www.youtube.com/my_videos

Read the full API docs on the Google+ website https://developers.google.com/youtube/v3/

Uses the Google APIs Client Library for Node.js https://github.com/google/google-api-nodejs-client

### Google Registration ###
1. https://console.developers.google.com

2. Create New Project

3. To get `Google+ API` Access go to: APIs & Auth->APIs
![Register API](https://github.com/rajeshujade/nodejs-upload-youtube-video-using-google-api/blob/master/screenshot/3.png)

4. To Get `client_id & client_secret` go to: APIs & Auth->Credentials->Create new Client ID
![Client ID](https://github.com/rajeshujade/nodejs-upload-youtube-video-using-google-api/blob/master/screenshot/4.png)

5. To Get `api_key` go to: APIs & Auth->Credentials->Create New Key->Browser key
![Browser Key](https://github.com/rajeshujade/nodejs-upload-youtube-video-using-google-api/blob/master/screenshot/5.png)
