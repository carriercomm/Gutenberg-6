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
    listSelector  : '.list-group',
    events        : {
      'keyup input' : 'filterUsers'
    }
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


  view.prototype.filterUsers = function(e){
    var $listings = $(this.el).find('.list-group-item');
    var val       = $(e.target).val();

    if(val == ''){
      $listings.removeClass('hide');
    } else {
      $listings.each(function(key, item){
        var name = $(item).find('.name').html().trim();
        if(name.indexOf(val) != -1) $(item).removeClass('hide')
        else $(item).addClass('hide');
      })
    }
  }

  return view;
});