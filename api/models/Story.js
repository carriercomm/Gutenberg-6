/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var _ = require('underscore');

module.exports = {
  attributes: {
    newsletter_id : {
      type        : 'STRING',
      defaultsTo  : '0',
      required    : true
    },
    title : {
      type        : 'STRING',
      defaultsTo  : ''
    },
    body : {
      type        : 'TEXT',
      defaultsTo  : ''
    },
    teaser : {
      type        : 'STRING',
      defaultsTo  : ''
    },
    sort_index : {
      type      : 'INTEGER',
      defaultsTo: 0
    }
  },


  beforeDestroy : function(props, next){

    // Delete all Image models associated with this story
    Image.find().where({ story_id: props.where.id }).exec(function(err, models){
      if(err) console.log(err)

      for(var i = 0; i<models.length; i++){
        models[i].destroy(function(error){
          if(error) console.log(error);
        });
      }
    });

    // Delete all Video models associated with this story
    Video.find().where({ story_id: props.where.id }).exec(function(err, models){
      if(err) console.log(err)

      for(var i = 0; i<models.length; i++){
        models[i].destroy(function(error){
          if(error) console.log(error);
        });
      }
    });

    Story.findOne({ id: props.where.id }).exec(function(err, modelToBeDeleted){
      if(modelToBeDeleted){
        Story.find().where({ newsletter_id : modelToBeDeleted.newsletter_id }).exec(function(err, collection){

          // Get a list of all models not scheduled for deletion
          var currentModels = _.reject(collection, function(model){
            return model.id == modelToBeDeleted.id;
          });

          // Find out all the sort indeces and resort
          for(var key in currentModels[0]){
            if(key.indexOf('sort_') != -1) {
              var modelsToReindex = [];
              currentModels.forEach(function(model){
                if(model[key] > modelToBeDeleted[key]) modelsToReindex.push(model)
              });

              if(modelsToReindex){
                modelsToReindex.forEach(function(model){
                  var newIndex  = model[key] - 1;
                  model[key]    = newIndex;
                });
              }
            }
          }

          // Save all these updates
          currentModels.forEach(function(model){
            model.save(function(err){
              if(err) console.log(err);
              // Why? I just don't know...
              var update = JSON.stringify(model);
              Story.publishUpdate(model.id, JSON.parse(update));
            });
          });

        });
      }
    });

    next();
  }
};
