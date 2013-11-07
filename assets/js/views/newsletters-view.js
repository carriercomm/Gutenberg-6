define([
  'chaplin',
  'views/base/collection-view',
  'views/newsletter-mini-view',
  'text!templates/newsletters.hbs',
], function(Chaplin, CollectionView, NewsletterMiniView, template){
  'use strict';

  var View = CollectionView.extend({
    className     : 'panel panel-default',
    template      : template,
    itemView      : NewsletterMiniView,
    listSelector  : '.list-group'
  });

  View.prototype.render = function(){
    Chaplin.CollectionView.prototype.render.apply(this, arguments);
  };

  return View;
});