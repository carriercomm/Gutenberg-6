define([
  'chaplin',
  'ejs',
  'views/base/view',
  'views/story-view',
], function(Chaplin, ejs, View, StoryView){
  'use strict';

  var view = View.extend({});


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
      var html          = this.options.template(passedOptions);

      $(this.el).html(html);
    }
  };

  return view;
});