define([
  'chaplin',
  'models/base/model',
  'models/images'
], function(Chaplin, Model, Images){
  'use strict';

  var model = Model.extend({

    blacklist : ['images'],
    toJSON    : function(options){
      return _.omit(this.attributes, this.blacklist);
    },

    initialize : function(data){
      Model.prototype.initialize.apply(this, arguments);

      var images    = new Images();
      images.url    = '/image';
      images.params = {
        story_id : data.id
      };
      images.listen();

      var self = this;
      this.set('images', images);
      this.listenTo(images, 'all', function(){
        self.set('images', images);
      });
    }
  });

  return model;
});