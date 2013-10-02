define([
  'chaplin',
  'ejs',
  'views/base/view'
], function(Chaplin, ejs, View){
  'use strict';

  var view = View.extend({});


  view.prototype.dragStart = function(e, context){
    context.dragId = $(e.target).data('storyid');
  };


  view.prototype.dragOver = function(e, context){
    e.preventDefault();
    e.stopPropagation();

    context.dropId = $(e.currentTarget).data('storyid');
  };


  view.prototype.drop = function(e, context){
    if(context.dragId && context.dropId){
      context.publishEvent('story_channel_index_update', context.dragId, context.dropId);
      context.dragId = undefined;
      context.dropId = undefined;
    }
  };


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.subscribeEvent('channels_registered', this.registerTemplates);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.collection, 'change', this.render);
  };


  view.prototype.registerTemplates = function(channels){
    var index             = this.options.params.templateIndex;
    this.options.template = ejs.compile(channels[index].templates.preview);
    this.registered       = true;
    this.render();
  };


  view.prototype.render = function(){
    var self = this;

    if(this.registered){
      // The regular toJSON method cannot be used here since i'm using
      // it to blacklist attributes for socket saves. 
      var stories = [];
      for(var i=0; i<this.collection.models.length; i++){
        var story  = _.clone(this.collection.models[i]);
        var images = story.get('images');

        //story.attributes.images = images.length ? images.toJSON() : []
        stories.push(story.attributes);
      }

      var passedOptions = {
        stories     : stories,
        newsletter  : this.model.attributes
      };
      var html = this.options.template(passedOptions);

      $(this.el).html(html);

      $('.draggable').bind('dragstart', function(e){ self.dragStart(e, self); });
      $('.draggable').bind('drop', function(e){ self.drop(e, self); });
      $('.draggable').bind('dragover', function(e){ self.dragOver(e, self); });
      $('.draggable').bind('dragenter', function(e){ e.preventDefault(); e.stopPropagation(); });
    }
  };

  return view;
});