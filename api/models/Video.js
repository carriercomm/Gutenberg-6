/**
 * Video
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var request = require('request');

module.exports = {

  attributes: {
    url : {
      type      : 'STRING',
      defaultsTo: ''
    },
    image_url : {
      type      : 'STRING',
      defaultsTo: ''
    },
    story_id : {
      type      : 'STRING',
      defaultsTo: 0
    },
    sort_index : {
      type      : 'INTEGER',
      defaultsTo: 0
    }
  },


  beforeCreate : function(props, next){
    Video.find({ story_id : props.story_id}).exec(function(err, collection){
      props.sort_index = collection.length;

      if(props.url){
        // If url is passed in, go get the video image
        var requestEarl = '';

        // YouTube
        if(props.url.indexOf('youtube.com') != -1 ){
          var splits = props.url.split('?v=');
          props.image_url = 'http://img.youtube.com/vi/' + splits[1] + '/1.jpg';
          next();
        }

        // Vimeo
        if(props.url.indexOf('vimeo.com') != -1 ){
          var splits = props.url.split('/')
          var vidId  = splits[splits.length - 1];
          var requestEarl = 'http://vimeo.com/api/v2/video/' + vidId + '.json';

          request(requestEarl, function(err, res, body){
            if(err) props.image_url = '/images/vimeo.jpg'
            else props.image_url = JSON.parse(body)[0].thumbnail_medium
            next();
          });
        }
      } else {
        props.image_url = '/images/video.jpg';
        next();
      }
    });
  }

};
