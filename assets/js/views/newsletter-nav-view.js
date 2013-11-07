define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterNav.hbs'
], function(Chaplin, View, template){
  'use strict';


  var view = View.extend({
    template      : template,
    tagName       : 'ul',
    className     : 'nav nav-tabs',
    events        : {
      'click a'   : 'handleRoute',
    }
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:channels', this.reRender);
  };


  view.prototype.reRender = function(){
    this.render();
  };


  view.prototype.handleRoute = function(e){
    e.preventDefault();
    var index = $(e.target).data('index');
  };

  return view;
});