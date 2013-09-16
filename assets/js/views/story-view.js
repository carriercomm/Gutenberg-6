define([
  'chaplin',
  'handlebars',
  'uploader',
  'sortable',
  'views/base/view',
  'views/base/collection-view',
  'views/image-view',
  'text!templates/story.hbs',
  'text!templates/uploader.hbs',
  'text!templates/uploader-dumb.hbs'
], function(Chaplin, Handlebars, Uploader, Sortable, View, CollectionView, ImageView, storyTemplate, uploaderTemplate, dumbUploaderTemplate){
  'use strict';

  var StoryView = View.extend({
    className     : 'story',
    template      : storyTemplate,
    schedule      : {},
    events        : {
      'click .destroy'        : 'destroy',
      'click .sort-button'    : 'handleSort',
      'focus input, textarea' : 'inputFocused',
      'blur input, textarea'  : 'inputBlurred',
      'keyup'                 : 'scheduleSave'
    }
  });


  StoryView.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  StoryView.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  StoryView.prototype.handleSort = function(e){
    var direction = 'up';
    if($(e.target).hasClass('down')) direction = 'down'

    Chaplin.mediator.publish('storyIndexUpdate', this.model, direction);
  };


  StoryView.prototype.destroy = function(e){
    e.preventDefault();
    this.model.destroy();
    Chaplin.mediator.publish('storyDelete');
  };


  StoryView.prototype.scheduleSave = function(e){
    var self = this;
    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.save();
    }, 100);
  };


  StoryView.prototype.save = function(){
    this.model.set({
      title   : $(this.el).find('.title').val(),
      body    : $(this.el).find('.body').val(),
      teaser  : $(this.el).find('.teaser').val()
    });

    this.model.save();
  };


  StoryView.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    var story_id = this.model.get('id');
    var self     = this;

    // Update the inputs only if the updates came from a seperate socket
    this.model.on('change', function(){
      var attrs = this.attributes
      for(var key in attrs){
        var selector  = $('.' + key);
        var $el       = $(self.el).find(selector);

        if(!$el.hasClass('preventUpdate')) $(self.el).find(selector).val(attrs[key]);
      }
    });

    // Optionally setup FineUploader if the module is loaded
    if(typeof Uploader != 'undefined'){
      $(this.el).find('.add-images').fineUploader({
        request   : { endpoint      : '/uploadImage?story_id=' + story_id },
        text      : { uploadButton  : 'Upload Images' },
        classes   : { success       : 'alert alert-success', fail : 'alert alert-error' },
        template  : uploaderTemplate
      });
    } else{
      var template = Handlebars.compile(dumbUploaderTemplate);
      $(this.el).find('.add-images').replaceWith(template({ storyId : story_id }));
    }


    // -- > This eventually should go in it's own view, but I was having trouble with
    // -- > the dom elements not appearing? 
    // Create the images view
    var imagesView = new CollectionView({
      collection    : this.model.get('images'),
      tagName       : 'ul',
      className     : 'image-list',
      listSelector  : '.image-list',
      itemView      : ImageView,
      container     : $(this.el).find('.image-list-container')
    });

    var reindexImages = function(){
      var $images = $(self.el).find('.image-list').find('li');
      var savedModels = 0;

      $.each($images, function(index, el){
        // Set the new sort index
        var modelId = $(el).find('.image').data('id');
        var model   = self.model.get('images').get(modelId);
        model.set('sort_index', index);

        // Remove the prevent class if all models have been succesfully saved
        model.save(model.attributes, {
          success : function(){
            savedModels++;
            if(savedModels == $images.length) {
              $(self.el).find('.image-list').removeClass('preventUpdate');
            }
          }
        });
      });
    };

    // Listen for updates, but only rerender if allowed
    var resortable = true
    imagesView.listenTo(this.model.get('images'), 'change', function(model){
      if(!$(self.el).find('.image-list').hasClass('preventUpdate')){
        self.model.get('images').sort();
        imagesView.renderAllItems();
      }
    });

    // Listen for updates to the image collection and
    // reattach sorter when new images are added
    var attachSorter = function(){
      $(self.el).find('.image-list').sortable('destroy');
      $(self.el).find('.image-list').sortable().bind('sortupdate', function(e, ui){
        $(self.el).find('.image-list').addClass('preventUpdate');
        reindexImages();
      });
    };
    this.model.get('images').on('all', attachSorter);

  };


  return StoryView;
});