define([
  'chaplin',
  'models/base/collection',
  'models/Publication'
], function(Chaplin, Collection, Publication){
  'use strict';

  var collection = Collection.extend({
    model : Publication
  });

  return collection;
});