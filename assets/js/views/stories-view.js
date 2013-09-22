define([
  'chaplin',
  'ejs',
  'views/base/view',
  'views/story-view',
], function(Chaplin, ejs, View, StoryView){
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
    this.options.template = ejs.compile(channels[index].templates.preview);
    this.render();
  };


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    if(!$(this.el).find('.stories-list').hasClass('preventUpdate')){
      this.collection.sort();
    }

    var passedOptions = { story : this.collection.toJSON() };
    var html          = this.options.template(passedOptions);

    $(this.el).html(html);
  };

  return view;
});