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

  View.prototype.setTitle = function(title){
    $(this.el).find('.panel-heading').find('h4').text(title);
  };

  return View;
});