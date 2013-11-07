/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var fs = require('fs');

module.exports = {

  attributes: {
    url : {
      type      : 'STRING',
      defaultsTo: ''
    },
    name : {
      type      : 'STRING',
      defaultsTo: '0'
    },
    story_id : {
      type      : 'STRING',
      defaultsTo: '0'
    },
    order : {
      type      : 'STRING',
      defaultsTo: '0'
    }
  },

  beforeDestroy : function(props, next){
    Image.findOne({ id: props.where.id }).exec(function(err, model){
      var imagePath = process.cwd() + model.url;

      fs.unlink(imagePath, function (err) {
        if (err) console.log(err);
        else console.log('successfully deleted file');
      });

      next();
    });
  }
};