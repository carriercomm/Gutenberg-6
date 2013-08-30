define([
  'chaplin',
  'views/base/collection-view',
  'views/story-view',
  'text!templates/newsletter.hbs'
], function(Chaplin, CollectionView, StoryView, newsletterTemplate){
  'use strict';

  var view = CollectionView.extend({
    template      : newsletterTemplate,
    itemView      : StoryView,
    listSelector  : '#stories'
  });

  return view;
});