define([
  'chaplin',
  'views/base/view',
  'jcrop',
  'text!templates/imageCrop.hbs'
], function(Chaplin, View, jcrop, template){
  'use strict';

  var view = View.extend({
    className : 'modal fade in',
    template  : template,
    events    : {
      'click .image-preview'  : 'clickPreview',
      'click .save'           : 'saveImages'
    }
  });

  var initCrop = function(croppableItem, context){

    // Cache some dommy stuff
    var imgWidth    = $('#crop-target').width();
    var imgHeight   = $('#crop-target').height();
    var $cropPrev   = $('#' + croppableItem.title);

    // Setup crop options
    var settings      = _.findWhere(context.model.collection.channels, {title : croppableItem.title}).crop;
    var cropOpts      = settings.cropOptions || {};
    cropOpts.onChange = function(coords){
      showPreview(settings, croppableItem, coords, imgWidth, imgHeight, $cropPrev, context);
    };

    // Show preview when initting
    if(croppableItem.coords){
      showPreview(settings, croppableItem, croppableItem.coords, imgWidth, imgHeight, $cropPrev, context);
    }

    // Clean up old cropper and make a new one
    if(context.crop) context.crop.destroy();
    context.crop = $.Jcrop('#crop-target', cropOpts);
  };


  var showPreview = function(settings, croppableItem, coords, imgWidth, imgHeight, $cropPrev, context){

    if(typeof settings.width == 'undefined' || typeof settings.height == 'undefined'){
      // If no height or width is defined, use a free style preview
      $cropPrev.parent().css({
        width       : coords.w + 'px',
        height      : coords.h + 'px',
      });
      $cropPrev.css({
        marginLeft  : '-' + coords.x + 'px',
        marginTop   : '-' + coords.y + 'px'
      });
    } else{
      // Crop method which has defined x,y bounds
      var rx = settings.width / coords.w;
      var ry = settings.height / coords.h;

      $cropPrev.css({
        width       : Math.round(rx * imgWidth) + 'px',
        height      : Math.round(ry * imgHeight) + 'px',
        marginLeft  : '-' + Math.round(rx * coords.x) + 'px',
        marginTop   : '-' + Math.round(ry * coords.y) + 'px'
      });
    }

    // Write coords to object
    croppableItem.coords = coords
  };


  view.prototype.clickPreview = function(e){
    e.preventDefault();

    // Mark item as selected
    var $target = $(e.target);
    var id      = $target.attr('id');
    $(this.el).find('.image-preview-wrapper').removeClass('selected');
    $target.parent().addClass('selected');

    // Find the correct element, init
    var cropppableItems = this.model.get('crops');
    var croppableItem   = _.findWhere(cropppableItems, {'title' : id}) || {};

    initCrop(croppableItem, this);
  };


  view.prototype.saveImages = function(){
    // TODO: show a loader here before hiding the modal
    this.model.save();
    $('.modal').modal('hide');
  };


  view.prototype.render = function(){
    var self     = this;
    var channels = this.model.collection.channels;
    this.model.set('channels', this.model.collection.channels)
    Chaplin.View.prototype.render.apply(this, arguments);

    if(!this.model.get('crops')) this.model.set('crops', []);
    var crops = this.model.get('crops');

    // Ensure all crop settings are in order by merging the 
    // channels object with each crop setting
    for(var i=0; i<channels.length; i++){
      if(!(_.findWhere(crops, { title : channels[i].title }))){
        crops.push({
          title   : channels[i].title,
          coords  : {}
        })
      }
    }

    // Wait for primary image to load, then initialize cropper
    $(this.el).find('#crop-target').load(function(){
      for(var i=0; i<crops.length; i++){
        initCrop(crops[i], self);
      }
    });

  };

  return view;
});