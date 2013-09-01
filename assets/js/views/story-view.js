define([
  'chaplin',
  'uploader',
  'views/base/view',
  'text!templates/story.hbs',
  'text!templates/uploader.hbs',
  'text!templates/uploader-dumb.hbs'
], function(Chaplin, Uploader, View, storyTemplate, uploaderTemplate, dumbUploaderTemplate){
  'use strict';

  var view = View.extend({
    className     : 'story',
    template      : storyTemplate,
    render        : function(){

      Chaplin.View.prototype.render.apply(this, arguments);

      if(typeof Uploader != 'undefined'){
        $(this.el).find('.add-images').fineUploader({
          request   : {
            endpoint      : '/uploadImage?story_id=1'
          },
          text      : {
            uploadButton  : 'Upload Images'
          },
          template  : uploaderTemplate,
          classes   : {
            success       : 'alert alert-success',
            fail          : 'alert alert-error'
          }
        });
      } else{
        $(this.el).find('.add-images').replaceWith(dumbUploaderTemplate)
      }
    }
  });

  return view;
});