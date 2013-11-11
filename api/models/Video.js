/**
 * Video
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
    Video.find({ story_id : props.story_id}).exec(function(err, collection){
      props.sort_index = collection.length;
      next();
    });
  }

};
