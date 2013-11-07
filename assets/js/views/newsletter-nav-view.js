define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterNav.hbs'
], function(Chaplin, View, template){
  'use strict';


  var view = View.extend({
    template      : template,
    tagName       : 'ul',
    className     : 'nav nav-tabs'
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:channels', this.reRender);
  };


  view.prototype.reRender = function(){
    this.render();
  };


  view.prototype.select = function(id){
    if(typeof(id) == 'undefined') id = 'create'

    $(this.el).find('a').each(function(index, $el){
      if(id == $(this).attr('data-index')) $(this).parent().addClass('active')
      else $(this).parent().removeClass('active')
    });
  };

  return view;
});