define([
  'chaplin',
  'views/base/collection-view',
  'views/story-view',
], function(Chaplin, CollectionView, StoryView){
  'use strict';

  var view = CollectionView.extend({
    itemView      : StoryView,
    template      : '<div id="stories-wrapper"></div>',
    listSelector  : '#stories-wrapper'
  });

  return view;
});