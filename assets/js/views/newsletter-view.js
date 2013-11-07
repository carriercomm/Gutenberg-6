define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletter.hbs'
], function(Chaplin, View, newsletterTemplate){
  'use strict';

  var view = View.extend({
    template      : newsletterTemplate,
    attributes    : {
      'id'        : 'newsletter-view'
    },
    regions       : {
      'stories'   : '#stories',
      'nav'       : '#nav-container'
    },
    events        : {
      'click #add-story'        : 'addNewStory',
      'focus input#story-title' : 'inputFocused',
      'blur input#story-title'  : 'inputBlurred',
      'keyup input#story-title' : 'scheduleSave'
    }
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.subscribeEvent('update_title', this.updateTitle);
  };


  view.prototype.updateTitle = function(){
    var $el = $(this.el).find('#story-title');
    if(!$el.hasClass('preventUpdate')){
      $el.val(this.model.get('title'));
    }
  };


  view.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  view.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  view.prototype.scheduleSave = function(e){
    var self = this;
    this.schedule = setTimeout(function(){
      self.model.save({ title : $(self.el).find('#story-title').val() });
    }, 100);
  };


  view.prototype.addNewStory = function(e){
    e.preventDefault();
    this.publishEvent('create_new_story', this.model);
  };

  return view;
});