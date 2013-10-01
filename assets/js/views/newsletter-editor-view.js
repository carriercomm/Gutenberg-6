define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterEditor.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template      : template,
    attributes    : {
      'id'        : 'newsletter-editor-view'
    },
    regions       : {
      'stories'   : '#stories',
      'nav'       : '#nav-container'
    },
    events        : {
      'click #add-story'              : 'addNewStory',
      'focus .newsletter-attrs input' : 'inputFocused',
      'blur .newsletter-attrs input'  : 'inputBlurred',
      'keyup .newsletter-attrs input' : 'scheduleSave'
    }
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.updateDomWithModel);
  };


  view.prototype.updateDomWithModel = function(model){

    var attrs = model.attributes
    var $wrapper = $(this.el).find('.newsletter-attrs');

    for(var key in attrs){
      var selector  = '.' + key;
      var $el       = $wrapper.find(selector);

      if($el.length && !$el.hasClass('preventUpdate')){
        $el.val(attrs[key]);
      }
    }
  };


  view.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  view.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  view.prototype.scheduleSave = function(e){
    var self      = this;
    var attrs     = {};
    var $wrapper  = $(this.el).find('.newsletter-attrs');

    for(var key in this.model.attributes){
      var selector  = '.' + key;
      var $el       = $wrapper.find(selector);

      if($el.length){
        attrs[key] = $el.val();
      }
    }

    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.model.save(attrs);
    }, 100);
  };


  view.prototype.addNewStory = function(e){
    e.preventDefault();
    this.publishEvent('create_new_story', this.model);
  };

  return view;
});