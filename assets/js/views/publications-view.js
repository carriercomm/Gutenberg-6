define([
  'chaplin',
  'views/base/collection-view',
  'views/base/view',
  'text!templates/publicationMini.hbs',
  'text!templates/publications.hbs'
], function(Chaplin, CollectionView, View, miniTemplate, collectionTemplate){
  'use strict';

  var MiniView = View.extend({
    tagName       : 'a',
    className     : 'list-group-item',
    template      : miniTemplate,
    render : function(){
      Chaplin.View.prototype.render.apply(this, arguments);
      var earl = '/ui/publication/' + this.model.get('id');
      $(this.el).attr('href', earl);
    }
  });

  var View = CollectionView.extend({
    itemView      : MiniView,
    template      : collectionTemplate,
    listSelector  : '.list-group'
  });

  return View;
});