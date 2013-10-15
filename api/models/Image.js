/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var fs    = require('fs');
var path  = require('path');

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

    var getCropWrite = function(remoteURL, cropOptions, next){
      ImageService.get(remoteURL, function(localFilePath){
        ImageService.crop(localFilePath, cropOptions.coords, function(filePath){
          ImageService.write(filePath, function(remoteFilePath){
            cropOptions.url = remoteFilePath;
            next(cropOptions);
          })
        });
      });
    };

    // Loop over croppable items and crop if necessary
    var successes = 0;
    if(props.crops){
      var crops = props.crops;
      for(var i=0; i<crops.length; i++){
        if(crops[i].coords){
          getCropWrite(props.url, crops[i], function(newOptions){
            successes++
            if(successes >= crops.length) next();
          });
        }
      }
    } else next()
  }
};