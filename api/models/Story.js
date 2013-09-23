/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var wrench = require('wrench');

module.exports = {
  attributes: {
    newsletter_id : {
      type        : 'STRING',
      defaultsTo  : 0,
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
    },
    in_email : {
      type      : 'BOOLEAN',
      defaultsTo: false
    }
  },

  // Delete all story images when deleting the story
  beforeDestroy : function(props, next){

    // Delete the Image model
    Image.find().where({ story_id: props.where.id }).exec(function(err, models){
      if(err) console.log(err)
      for(var i = 0; i<models.length; i++){
        models[i].destroy(function(error){
          if(error) console.log(error);
        })
      }

      // Recrusively delete all images associated with this model
      wrench.rmdirSyncRecursive('assets/uploads/' + props.where.id, function(){});
    });

    next();
  },
};
