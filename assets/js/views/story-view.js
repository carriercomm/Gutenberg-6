define([
  'chaplin',
  'handlebars',
  'views/base/view',
], function(Chaplin, Handlebars, View){
  'use strict';

  var view = View.extend({
    className : 'story'
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.modelUpdate);
  };


  view.prototype.scheduleSave = function(e){
    var self = this;

    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.saveModel();
    }, 100);
  };


  // Whenever the model updates, update the corresponding input fields
  view.prototype.modelUpdate = function(model){
    var self  = this;
    var attrs = model.attributes

    for(var key in attrs){
      var selector  = '.' + key;
      var $el       = $(self.el).find(selector);
      $el.text(attrs[key]);
    }
  };

  return view;
});