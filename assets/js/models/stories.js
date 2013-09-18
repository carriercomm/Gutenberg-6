define([
  'models/base/collection',
  'models/story'
], function(Collection, Story){
  'use strict';

  var collection = Collection.extend({
    model : Story
  });

  collection.prototype.comparator = function(model){
    return model.get('sort_index');
  };

  return collection;
});