define([
  'chaplin',
  'models/base/model',
  'models/images',
  'models/videos'
], function(Chaplin, Model, Images, Videos){
  'use strict';

  var model = Model.extend({

    blacklist : ['images'],
    toJSON    : function(options){
      return _.omit(this.attributes, this.blacklist);
    },

    initialize : function(data){
      Model.prototype.initialize.apply(this, arguments);

      var self      = this;

      var images    = new Images();
      images.url    = '/image';
      images.params = {
        story_id : data.id
      };
      images.listen();

      var videos    = new Videos();
      videos.url    = '/video';
      videos.params = {
        story_id : data.id
      };
      videos.listen();

      this.set('images', images);
      this.listenTo(images, 'all', function(){
        self.set('images', images);
      });

      this.set('videos', videos);
      this.listenTo(videos, 'all', function(){
        self.set('videos', videos);
      });
    }
  });

  return model;
});