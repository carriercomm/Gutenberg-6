define([
  'controllers/base/controller',
  'models/publications',
  'views/publications'
], function(Controller, Collection, CollectionView){
  'use strict';

  var Publications = Controller.extend({
    showAll : function(params){
      this.collection = new Collection();
      this.view       = new CollectionView({
        collection  : this.collection
      });
    }
  });

  return Publications;
})