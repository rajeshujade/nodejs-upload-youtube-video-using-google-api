var express = require('express');
var router = express.Router();
var _ = require('underscore');
var youtube = require('../library/googleyoutube');
var youtube = new youtube();

router.get('/', function(req, res) {
  var code = (req.query.code) ? req.query.code : '';
  if(!youtube.isTokenExists()){
    if(!_.isEmpty(code)){
      tokens = youtube.getToken(code);   
      res.redirect('/welcome');     
    }else{
      var authURL = youtube.getAuthUrl();
      res.render('index', { title: 'Express', 'authURL':authURL});
    }	  
  }else{
    res.status(200).redirect('/welcome');  
  }  
});

router.get('/welcome', function(req, res) {
  res.render('welcome', { title: 'Express', 'command':'node scripts/youtube.js'});
});

module.exports = router;