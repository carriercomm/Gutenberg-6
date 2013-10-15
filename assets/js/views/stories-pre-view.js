define([
  'chaplin',
  'ejs',
  'views/base/view'
], function(Chaplin, ejs, View){
  'use strict';

  var view = View.extend({
    listen : {
      'channels_registered mediator' : 'registerTemplates',
      'change model'        : 'scheduleRender',
      'change collection'   : 'scheduleRender'
    }
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.renderTimeout = null;
  };


  view.prototype.scheduleRender = function(){
    var self = this;
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(function(){
      self.render();
    }, 100);
  };


  view.prototype.dragStart = function(e, context){
    context.dragId = $(e.target).data('storyid');
  };


  view.prototype.dragOver = function(e, context){
    e.preventDefault();
    e.stopPropagation();
    context.dropId = $(e.currentTarget).data('storyid');
  };


  view.prototype.drop = function(e, context, activeChannelTitle){
    if(context.dragId && context.dropId){
      context.publishEvent('story_index_swap', context.dragId, context.dropId, activeChannelTitle);
      context.dragId = undefined;
      context.dropId = undefined;
    }
  };


  view.prototype.registerTemplates = function(channels){
    this.channels     = channels;
    var index         = this.options.params.templateIndex;
    this.template     = ejs.compile(channels[index].templates.preview);
    this.registered   = true;
    this.render();
  };


  view.prototype.render = function(){

    var self = this;

    if(this.registered){

      // Find the active channel and create the namespace
      var activeChannel = _.findWhere(this.channels, { active : true });
      var namespace     = 'sort_channel_' + activeChannel.title + '_index';
      var stories       = this.collection.getSortedStoriesWithImages(namespace);

      var html          = this.template({
        stories         : stories,
        newsletter      : this.model.attributes
      });

      $(this.el).html(html);
      $('body').html($(this.el));

      $('.draggable').bind('dragstart', function(e){ self.dragStart(e, self); });
      $('.draggable').bind('drop', function(e){ self.drop(e, self, activeChannel.title); });
      $('.draggable').bind('dragover', function(e){ self.dragOver(e, self); });
      $('.draggable').bind('dragenter', function(e){ e.preventDefault(); e.stopPropagation(); });
    }
  };

  return view;
});