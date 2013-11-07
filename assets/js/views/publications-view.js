define([
  'chaplin',
  'views/base/collection-view',
  'views/publicationMini-view',
  'text!templates/publications.hbs'
], function(Chaplin, CollectionView, MiniView, template){
  'use strict';

  var View = CollectionView.extend({
    itemView      : MiniView,
    template      : template,
    listSelector  : '.list-group'
  });

  return View;
});