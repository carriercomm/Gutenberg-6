define([
  'chaplin',
  'handlebars',
  'views/base/view',
  'views/story-view',
], function(Chaplin, Handlebars, View, StoryView){
  'use strict';

  var view = View.extend({
    itemView      : StoryView,
    template      : '<div id="stories-wrapper"></div>',
    listSelector  : '#stories-wrapper'
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.subscribeEvent('channels_registered', this.registerTemplates);
    this.listenTo(this.collection, 'change', this.render);
  };


  view.prototype.registerTemplates = function(channels){
    var index             = this.options.params.templateIndex;
    this.options.template = Handlebars.compile(channels[index].templates.preview);
    this.render();
  };


  view.prototype.render = function(channels){
    Chaplin.View.prototype.render.apply(this, arguments);

    var passedOptions = { story : this.collection.toJSON() };
    var html          = this.options.template(passedOptions);

    if(!$(this.el).find('.stories-list').hasClass('preventUpdate')){
      this.collection.sort();
    }

    $(this.el).html(html);
  };

  return view;
});