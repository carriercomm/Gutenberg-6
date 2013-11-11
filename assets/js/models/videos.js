define([
  'chaplin',
  'models/base/collection',
  'models/base/model'
], function(Chaplin, Collection, Model){
  'use strict';

  var collection = Collection.extend({

    model : Model,

    comparator : function(model){
      return model.get('sort_index');
    }

  });

  return collection;
});