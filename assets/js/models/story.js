define([
  'chaplin',
  'models/base/model',
  'models/base/collection'
], function(Chaplin, Model, Collection){
  'use strict';

  var model = Model.extend({

    initialize : function(data){
      var images    = new Collection();
      images.url    = '/image';
      images.params = {
        story_id : data.id
      };
      images.listen();

      this.set('images', images);
    }
  });

  return model;
});