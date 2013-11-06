define([
  'chaplin',
  'models/base/collection',
  'models/publication'
], function(Chaplin, Collection, Publication){
  'use strict';

  var collection = Collection.extend({
    model : Publication,
    comparator : function(model){
      return model.get('title');
    }
  });

  return collection;
});