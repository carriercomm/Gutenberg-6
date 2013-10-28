/**
 * Publication
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    title : {
      type      : 'STRING',
      required  : true,
      maxLength : 256
    },
    channels : {
      type      : 'ARRAY',
      defaultsTo: []
    },
    owners : {
      type      : 'ARRAY',
      defaultsTo: []
    },
    editors : {
      type      : 'ARRAY',
      defaultsTo: []
    }
  },

  beforeDestroy : function(props, next){
    // Delete the story reference when deleting the model
    Newsletter.find({ publication_id: props.where.id }).exec(function(err, newsletters){

      for(var i=0; i<newsletters.length; i++){
        newsletters[i].destroy(function(error){
          if(error) console.log(error);
        });
      }

    });

    next()
  }
};