define([
  'chaplin',
  'views/base/collection-view',
  'views/story-view',
  'text!templates/stories.hbs'
], function(Chaplin, CollectionView, StoryView, template){
  'use strict';

  var view = CollectionView.extend({
    itemView      : StoryView,
    template      : template,
    listSelector  : '#stories-wrapper'
  });

  return view;
});