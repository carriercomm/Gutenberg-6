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
      'keyup input' : 'filterUsers',
      'click input' : 'filterUsers'
    }
  });


  view.prototype.initItemView = function(model){
    return new this.itemView({
      model           : model,
      collectionView  : this,
      publication     : this.options.publication
    });
  };


  view.prototype.filterUsers = function(){
    var self = this;

    var inputVal  = $('input.username').val();
    var $listings = $(this.el).find('.list-group-item');
    var $filters  = $('input[type="checkbox"]');

    $listings.each(function(key, item){
      var hide = false;
      var $el  = $(item);

      $filters.each(function(key, filterItem){
        if(!$(filterItem).is(':checked')){
          var name = $(filterItem).attr('name');
          if($el.data(name) == 'yes') hide = true
        };
      });

      if($el.find('.name').text().trim().indexOf(inputVal) == -1) hide = true

      if(hide == true) $(item).addClass('hide')
      else $(item).removeClass('hide')
    });
  }

  return view;
});