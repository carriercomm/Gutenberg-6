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
    tagName       : 'li',
    className     : 'image-container media-container',
    events        : {
      'click .delete' : 'deleteImage',
      'click .edit'   : 'editImage'
    }
  });


  view.prototype.deleteImage = function(e) {
    e.preventDefault();
    this.model.destroy();
  };


  view.prototype.editImage = function(e) {
    Chaplin.View.prototype.render.apply(this, arguments);
    e.preventDefault();

    var cropView = new CropView({
      autoRender  : true,
      model       : this.model,
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
  };

  return view;
});