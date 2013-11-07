define([
  'chaplin',
  'models/base/collection'
], function(Chaplin, Collection){
  'use strict';

  var collection = Collection.extend({

    parse : function(data){
      Collection.prototype.parse.apply(this, arguments);
      return data.results
    },

    comparator : function(image){
      return image.get('sort_index');
    }

  });

  return collection;
});