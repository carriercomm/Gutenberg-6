define([
  'bootstrap',
  'controllers/base/controller',
  'models/base/model',
  'views/imageCrop-view'
], function(bootstrap, Controller, Model, View){
  'use strict';

  var ImageCrop = Controller.extend({

    crop : function(params){

      var model = new Model();

      // Placeholder until I add crop settings to the Newsletter model
      var croppableItems = [
        {
          domId         : 'postImage',
          title         : 'Post Image',
          width         : '300',
          height        : '150',
          cropOptions   : {
            aspectRatio     : '2'
          }
        },
        {
          domId         : 'emailImage',
          title         : 'Email Image',
          width         : '200',
          height        : '200',
          cropOptions   : {
            aspectRatio     : '1'
          }
        },
        {
          domId         : 'freeImage',
          title         : 'Free Image'
        },
        {
          domId         : 'vmlCom',
          title         : 'VML.com Image',
          width         : '400',
          height        : '400',
          cropOptions   : {
            aspectRatio     : 1
          }
        }
      ]
      model.set('croppableItems', croppableItems);
      // End Placeholder

      model.url = '/image/' + params.imageId
      model.fetch({
        success : function(){
          var cropView = new View({
            autoRender  : true,
            model       : model,
            region      : 'main',
            className   : 'modal',
            attributes  : {
              'id'      : 'image-cropper'
            }
          });

          $('#image-cropper').modal();
        }
      });
    }
  });

  return ImageCrop;
})