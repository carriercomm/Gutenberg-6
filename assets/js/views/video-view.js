define([
  'chaplin',
  'bootstrap',
  'models/base/model',
  'views/base/view',
  'views/videoEdit-view',
  'text!templates/video.hbs'
], function(Chaplin, bootstrap, Model, View, VideoEditView, template){
  'use strict';

  var view = View.extend({
    template      : template,
    tagName       : 'li',
    className     : 'video-container media-container',
    events        : {
      'click .delete' : 'deleteVideo',
      'click .edit'   : 'editVideo'
    },
    listen        : {
      'change model' : 'render'
    }
  });


  view.prototype.deleteVideo = function(e) {
    e.preventDefault();
    this.model.destroy();
  };

  view.prototype.editVideo = function(e) {
    e.preventDefault();

    var videoModal  = new VideoEditView({
      model         : this.model,
      autoRender    : true,
      region        : 'main',
      className     : 'modal'
    });
  };

  return view;
});