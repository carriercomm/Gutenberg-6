define([
  'controllers/base/controller',
  'models/base/collection',
  'models/base/model',
  'views/publications-view'
], function(Controller, Collection, Model, CollectionView){
  'use strict';

  var Publications = Controller.extend({
    showAll : function(params){
      this.collection     = new Collection();
      this.collection.url = '/publication';
      this.collection.listen();

      this.view       = new CollectionView({
        collection  : this.collection,
        region      : 'main'
      });
    },

    showOne : function(params){
      this.model      = new Model();
      this.model.url  = '/publication';
    }
  });

  return Publications;
})