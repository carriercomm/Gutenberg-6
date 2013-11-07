/**
 * Newsletter
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    title : {
      defaultsTo  : 'New Newsletter',
      type        : 'STRING',
      maxLength   : 256
    },
    publication_id : {
      type        : 'STRING',
      defaultsTo  : 0
    },
    tags : {
      type        : 'STRING',
      defaultsTo  : ''
    },
    published : {
      type        : 'BOOLEAN',
      defaultsTo  : false
    }
  },

  beforeDestroy : function(props, next){
    // Delete the story reference when deleting the model
    Story.find({ newsletter_id: props.where.id }).exec(function(err, stories){
      for(var i=0; i<stories.length; i++){
        stories[i].destroy(function(error){
          if(error) console.log(error);
        });
      }
    });

    next();
  }
};
