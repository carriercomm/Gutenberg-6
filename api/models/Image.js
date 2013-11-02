/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var fs      = require('fs');
var path    = require('path');
var _       = require('underscore');
var events  = require('events');

module.exports = {

  attributes: {
    url : {
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
    Image.find({ story_id : props.story_id}).exec(function(err, collection){
      props.sort_index = collection.length;
      next();
    });
  },


  beforeDestroy : function(props, next){
    // Delete the image reference when deleting the model
    Image.findOne({ id: props.where.id }).exec(function(err, model){

      // Destroy primary image
      ImageService.destroy(model.url);

      // Loop over cropped items and destroy all of them
      if(model.crops){
        model.crops.forEach(function(item){
          if(item.url){
            ImageService.destroy(item.url);
          }
        });
      }

      next();
    });
  },


  beforeUpdate : function(props, next){

    var getCropWrite = function(remoteURL, cropOptions, cb){
      ImageService.get(remoteURL, function(localFilePath){
        ImageService.crop(localFilePath, cropOptions.coords, function(filePath){
          ImageService.write(filePath, function(remoteFilePath){
            cropOptions.url = remoteFilePath;
            cb();
          });
        });
      });
    };

    // Define the new crop properties
    var newCrops = [];
    if(props.crops) newCrops = props.crops;

    // Set up event emitter to handle 
    var isReady   = new events.EventEmitter();
    var successes = 0;
    isReady.on('testLength', function(){
      successes++;
      if(successes == newCrops.length) next();
    });

    Image.findOne({ id: props.id }).exec(function(err, model){

      // Loop over croppable items and crop only if necessary
      for(var i=0; i<newCrops.length; i++){
        var currentCrop   = _.findWhere(model.crops, { title : newCrops[i].title });
        var currentCoords = {};
        var newCoords     = {};

        // Ensure crops exist in current model
        // and crop properties are specified from interface
        if(currentCrop && currentCrop.coords) currentCoords = currentCrop.coords
        if(newCrops[i].coords) newCoords = newCrops[i].coords;

        // Compare crops to current model
        if(JSON.stringify(currentCoords) != JSON.stringify(newCrops[i].coords)){
          getCropWrite(props.url, newCrops[i], function(){
            isReady.emit('testLength');
          });
        } else{ isReady.emit('testLength'); }
      }

      if(newCrops.length == 0) next();
    });

  }
};