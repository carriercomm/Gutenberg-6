define([
  'chaplin',
  'views/base/collection-view',
  'views/base/view',
  'text!templates/newsletters.hbs',
  'text!templates/newsletterMini.hbs'
], function(Chaplin, CollectionView, View, collectionTemplate, miniTemplate){
  'use strict';

  var MiniView = View.extend({
    tagName       : 'a',
    className     : 'list-group-item',
    template      : miniTemplate,
    render : function(){
      Chaplin.View.prototype.render.apply(this, arguments);
      var earl = '/ui/newsletter/' + this.model.get('id');
      $(this.el).attr('href', earl);
    }
  });

  var View = CollectionView.extend({
    className     : 'panel panel-default',
    template      : collectionTemplate,
    itemView      : MiniView,
    listSelector  : '.list-group'
  });

  View.prototype.setTitle = function(title){
    $(this.el).find('.panel-heading').find('h4').text(title);
  };

  return View;
});