define([
  'chaplin',
  'models/base/model',
  'models/base/collection'
], function(Chaplin, Model, Collection){
  'use strict';

  var model = Model.extend({

    initialize : function(data){
      Model.prototype.initialize.apply(this, arguments);

      var images    = new Collection();
      images.url    = '/image';
      images.params = {
        story_id : data.id
      };
      images.listen({ parentIdentifier : 'story_id' });
      images.comparator = function(image){
        return image.get('sort_index');
      }

      this.set('images', images);
      var self = this;
      this.on('all', function(){
        self.set('images', images);
      });
    }
  });

  return model;
});