define([
  'chaplin',
  'views/base/collection-view',
  'views/newsletter-mini-view',
  'text!templates/newsletters.hbs',
], function(Chaplin, CollectionView, NewsletterMiniView, template){
  'use strict';

  var view = CollectionView.extend({
    template      : template,
    itemView      : NewsletterMiniView,
    listSelector  : '.list-group',
    events    : {
      'click #add-newsletter' : 'createNewsletter'
    }
  });

  view.prototype.createNewsletter = function(e){
    e.preventDefault();
    this.publishEvent('create_newsletter', this.options.publication);
  }

  return view;
});