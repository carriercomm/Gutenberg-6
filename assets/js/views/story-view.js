define([
  'chaplin',
  'uploader',
  'views/base/view',
  'views/base/collection-view',
  'views/image-view',
  'text!templates/story.hbs',
  'text!templates/uploader.hbs',
  'text!templates/uploader-dumb.hbs'
], function(Chaplin, Uploader, View, CollectionView, ImageView, storyTemplate, uploaderTemplate, dumbUploaderTemplate){
  'use strict';

  var primaryView = View.extend({
    className     : 'story',
    template      : storyTemplate,
    render        : function(){

      Chaplin.View.prototype.render.apply(this, arguments);

      // Optionally setup FineUploader if the module is loaded
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

      // Create the images view
      var imagesView = new CollectionView({
        autoRender    : true,
        collection    : this.model.get('images'),
        className     : 'image-list',
        listSelector  : '.image-list',
        itemView      : ImageView,
        container     : $(this.el).find('.image-list-container')
      });
    }
  });


  return primaryView;
});