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

      this.view = new CollectionView({
        collection  : this.collection,
        region      : 'main'
      });

      // Bind the view to the updates
      var view = this.view;
      this.view.listenTo(this.collection, 'change', function(model){
        view.renderItem(model);
      });
    },

    showOne : function(params){
      this.model      = new Model();
      this.model.url  = '/publication';
    }
  });

  return Publications;
})