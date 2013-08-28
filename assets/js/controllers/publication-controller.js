define([
  'controllers/base/controller',
  'models/base/collection',
  'views/publications-view'
], function(Controller, Collection, CollectionView){
  'use strict';

  var Publications = Controller.extend({
    showAll : function(params){
      this.collection     = new Collection()
      this.collection.url = '/publication';
      this.collection.fetch();

      this.view       = new CollectionView({
        collection  : this.collection,
        region      : 'main'
      });
    }
  });

  return Publications;
})