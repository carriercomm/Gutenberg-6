define([
  'chaplin',
  'bootstrap',
  'models/base/model',
  'views/base/view',
  'views/imageCrop-view',
  'text!templates/image.hbs'
], function(Chaplin, bootstrap, Model, View, CropView, template){
  'use strict';

  var view = View.extend({
    template      : template,
    className     : 'image-container',
    events        : {
      'click .delete' : 'deleteImage',
      'click .edit'   : 'editImage'
    }
  });

  view.prototype.deleteImage = function(e) {
    Chaplin.View.prototype.render.apply(this, arguments);
    e.preventDefault();

    var id = $(e.target).data('id');
    var earl = '/image/destroy/' + id;

    $.ajax({ url : '/image/destroy/' + id });
  };


  view.prototype.editImage = function(e) {
    Chaplin.View.prototype.render.apply(this, arguments);
    e.preventDefault();

    var model = new Model();
    model.url = '/image/' + $(e.target).data('id');

    // Placeholder until I add crop settings to the Newsletter model
    var croppableItems = [
      { domId : 'postImage', title : 'Post Image', width : '300', height : '150', cropOptions : { aspectRatio : '2' }},
      { domId : 'emailImage', title : 'Email Image', width : '200', height : '200', cropOptions : { aspectRatio : '1' }},
      { domId : 'freeImage', title : 'Free Image' },
      { domId : 'vmlCom', title : 'VML.com Image', width : '400', height : '400', cropOptions : { aspectRatio : 1 }}
    ]
    model.set('croppableItems', croppableItems);
    // End Placeholder

    model.fetch({
      success : function(){
        var cropView = new CropView({
          autoRender  : true,
          model       : model,
          region      : 'main',
          className   : 'modal',
          attributes  : {
            'id'      : 'image-cropper'
          }
        });

        $('#image-cropper').modal();
        $('#image-cropper').on('hidden.bs.modal', function(){
          $('#image-cropper').remove();
        });
      }
    });
  };

  return view;
});