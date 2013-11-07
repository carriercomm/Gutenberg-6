define([
  'models/base/collection',
  'models/story'
], function(Collection, Story){
  'use strict';

  var collection = Collection.extend({
    model : Story
  });

  return collection;
});