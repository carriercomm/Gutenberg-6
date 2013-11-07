define([
  'chaplin',
  'models/base/collection',
  'models/user'
], function(Chaplin, Collection, User){
  'use strict';

  var collection = Collection.extend({
    model : User
  });


  collection.prototype.comparator = function(model){
    return model.get('username');
  };

  return collection;
});