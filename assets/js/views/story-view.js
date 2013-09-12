define([
  'chaplin',
  'handlebars',
  'uploader',
  'views/base/view',
  'views/base/collection-view',
  'views/image-view',
  'text!templates/story.hbs',
  'text!templates/uploader.hbs',
  'text!templates/uploader-dumb.hbs'
], function(Chaplin, Handlebars, Uploader, View, CollectionView, ImageView, storyTemplate, uploaderTemplate, dumbUploaderTemplate){
  'use strict';

  var primaryView = View.extend({
    className     : 'story',
    template      : storyTemplate,
    render        : function(){

      Chaplin.View.prototype.render.apply(this, arguments);
      var story_id = this.model.get('id');

      // Optionally setup FineUploader if the module is loaded
      if(typeof Uploader != 'undefined'){
        $(this.el).find('.add-images').fineUploader({
          request   : {
            endpoint      : '/uploadImage?story_id=' + story_id
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
        var template = Handlebars.compile(dumbUploaderTemplate);
        $(this.el).find('.add-images').replaceWith(template({ storyId : story_id }));
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