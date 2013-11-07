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


  view.prototype.initialize = function(){
    Chaplin.CollectionView.prototype.initialize.apply(this, arguments);
    this.options.publication.listenTo(this.options.publication, 'change', this.doSumthin)
  };


  view.prototype.initItemView = function(model){
    return new this.itemView({
      model           : model,
      collectionView  : this,
      publication     : this.options.publication
    });
  };

  return view;
});