define([
  'chaplin',
  'views/base/collection-view',
  'views/user-mini-view',
  'text!templates/users.hbs',
], function(Chaplin, CollectionView, UserMiniView, template){
  'use strict';

  var view = CollectionView.extend({
    template      : template,
    itemView      : UserMiniView,
    listSelector  : '.list-group'
  });

  return view;
});