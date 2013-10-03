define([
  'chaplin',
  'ejs',
  'views/base/view'
], function(Chaplin, ejs, View){
  'use strict';

  var view = View.extend({});


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.renderTimeout = null;
    this.subscribeEvent('channels_registered', this.registerTemplates);
    this.listenTo(this.model, 'change', this.scheduleRender);
    this.listenTo(this.collection, 'change', this.scheduleRender);
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
    this.channels         = channels;
    var index             = this.options.params.templateIndex;
    this.options.template = ejs.compile(channels[index].templates.preview);
    this.registered       = true;
    this.render();
  };


  view.prototype.render = function(){
    var self = this;

    if(this.registered){

      // Find the active channel and create the namespace
      var activeChannel = _.findWhere(this.channels, { active : true });
      var namespace     = 'sort_channel_' + activeChannel.title + '_index';

      // The regular toJSON method cannot be used here since i'm using
      // it to blacklist attributes for socket saves. 
      var stories = [];
      this.collection.each(function(model){
        var clone = _.clone(model);

        // Make a standard index property available for the templates
        var sort_index = clone.get(namespace)
        clone.set('sort_index', sort_index);

        stories.push(clone.attributes);
      });

      stories = _.sortBy(stories, function(item){
        return item[namespace]
      });

      var passedOptions = {
        stories     : stories,
        newsletter  : this.model.attributes
      };
      var html = this.options.template(passedOptions);

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