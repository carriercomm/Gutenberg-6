define([
  'chaplin',
  'models/base/collection',
  'models/image'
], function(Chaplin, Collection, Image){
  'use strict';

  var collection = Collection.extend({

    model : Image,

    parse : function(data){
      Collection.prototype.parse.apply(this, arguments);
      if(data.channels) this.channels = data.channels
      return data.results
    },

    comparator : function(image){
      return image.get('sort_index');
    }

  });

  return collection;
});