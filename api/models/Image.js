/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var fs    = require('fs');
var path  = require('path');
var _     = require('underscore');

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


  beforeDestroy : function(props, next){
    // Delete the image reference when deleting the model
    Image.findOne({ id: props.where.id }).exec(function(err, model){
      ImageService.destroy(model.url);
      next();
    });
  },


  beforeUpdate : function(props, next){

    var getCropWrite = function(remoteURL, cropOptions){
      ImageService.get(remoteURL, function(localFilePath){
        ImageService.crop(localFilePath, cropOptions.coords, function(filePath){
          ImageService.write(filePath, function(remoteFilePath){
            cropOptions.url = remoteFilePath;
          })
        });
      });
    };

    // Loop over croppable items and crop only if necessary
    if(props.crops){
      var newCrops = props.crops;

      Image.findOne({ id: props.id }).exec(function(err, model){

        for(var i=0; i<newCrops.length; i++){
          var currentCrop = _.findWhere(model.crops, { title : newCrops[i].title });

          // Compare crops to current model
          if(JSON.stringify(currentCrop) != JSON.stringify(newCrops[i])){

            // Ensure crop properties are specified in interface
            if(Object.keys(newCrops[i].coords).length){
              getCropWrite(props.url, newCrops[i]);
            }
          }
        }
      });

    }

    next();
  }
};