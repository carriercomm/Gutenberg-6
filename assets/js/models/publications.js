define([
  'chaplin',
  'models/base/collection',
  'models/publication'
], function(Chaplin, Collection, Publication){
  'use strict';

  var collection = Collection.extend({
    model : Publication
  });

  return collection;
});