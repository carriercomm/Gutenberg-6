define([
  'views/base/view',
  'jcrop',
  'text!templates/imageCrop.hbs'
], function(View, jcrop, template){
  'use strict';

  var view = View.extend({
    className : 'modal fade in',
    template  : template,
    events    : {
      'click .image-preview' : 'clickPreview'
    }
  });

  var initCrop = function(croppableItem, context){

    var showCroppedPreview = function(coords){
      var rx = previewW / coords.w;
      var ry = previewH / coords.h;

      $('#' + croppableItem.domId).css({
        width       : Math.round(rx * imgWidth) + 'px',
        height      : Math.round(ry * imgHeight) + 'px',
        marginLeft  : '-' + Math.round(rx * coords.x) + 'px',
        marginTop   : '-' + Math.round(ry * coords.y) + 'px'
      });
    };

    var showFreePreview = function(coords){
      $('#' + croppableItem.domId).parent().css({
        width       : coords.w + 'px',
        height      : coords.h + 'px',
      });
      $('#' + croppableItem.domId).css({
        marginLeft  : '-' + coords.x + 'px',
        marginTop   : '-' + coords.y + 'px'
      });
    };

    var imgWidth  = $('#crop-target').width();
    var imgHeight = $('#crop-target').height();

    var cropOpts  = croppableItem.cropOptions || {};
    var previewW  = croppableItem.width;
    var previewH  = croppableItem.height;

    // If no height or width is defined, use a free style preview
    if(typeof previewH == 'undefined' || typeof previewW == 'undefined'){
      cropOpts.onChange = showFreePreview;
      cropOpts.onSelect = showFreePreview;
    } else {
      cropOpts.onChange = showCroppedPreview;
      cropOpts.onSelect = showCroppedPreview;
    }

    // Clean up old cropper and make a new one
    if(context.crop) context.crop.destroy();
    context.crop = $.Jcrop('#crop-target', cropOpts);
  };

  view.prototype.clickPreview = function(e){
    e.preventDefault();

    var $target = $(e.target);
    var id      = $target.attr('id');
    $(this.el).find('.image-preview-wrapper').removeClass('selected');
    $target.parent().addClass('selected');

    var cropppableItems = this.model.get('croppableItems');
    var croppableItem   = _.findWhere(cropppableItems, {'domId' : id}) || {};

    initCrop(croppableItem, this);
  };

  return view;
});