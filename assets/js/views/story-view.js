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
      'keyup .story-editor'   : 'scheduleSave',
      'change input[type="checkbox"]' : 'checkboxChanged'
    }
  });


  StoryView.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  StoryView.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  StoryView.prototype.checkboxChanged = function(e){
    var attrs         = {};
    var inputName     = $(e.target).attr('name');
    var inputVal      = $(e.target).is(':checked');
    attrs[inputName]  = inputVal;

    this.model.save(attrs);
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
    var model = this.model;
    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      model.save();
    }, 100);
  };


  StoryView.prototype.save = function(){
    this.model.save({
      title   : $(this.el).find('.title').val(),
      body    : $(this.el).find('.body').val(),
      teaser  : $(this.el).find('.teaser').val()
    });
  };


  StoryView.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:sort_index', this.adjustIndexerButtons);
    this.listenTo(this.model, 'change', this.modelUpdate);
    this.listenTo(this.model.get('images'), 'all', this.attachSorter);
  };


  // Whenever the model updates, update the corresponding input fields
  StoryView.prototype.modelUpdate = function(model){
    var self  = this;
    var attrs = model.attributes

    for(var key in attrs){
      var selector  = '.' + key;
      var $el       = $(self.el).find(selector);

      if(!$el.hasClass('preventUpdate')){
        if($el.attr('type') == 'checkbox'){
          attrs[key] ? $el.prop('checked', true) : $el.prop('checked', false)
        } else $el.val(attrs[key]);
      }
    }
  };


  // Enable/disable the up/down buttons dependent on model index
  StoryView.prototype.adjustIndexerButtons = function(){
    var $el = $(this.el);

    $el.find('.sort-button.up').removeClass('btn-disabled');
    $el.find('.sort-button.down').removeClass('btn-disabled');

    if(this.model.get('sort_index') == 0){
      $el.find('.sort-button.up').addClass('btn-disabled');
    } else {
      var storiesLength = this.model.collection.models.length
      if(this.model.get('sort_index') == storiesLength - 1){
        $el.find('.sort-button.down').addClass('btn-disabled');
      }
    }
  };


  StoryView.prototype.attachSorter = function(){
    var self = this;
    var $el  = $(this.el);

    // Listen for updates to the image collection and
    // Reattach sorter when new images are added
    $el.find('.image-list').sortable('destroy');
    $el.find('.image-list').sortable().bind('sortupdate', function(e, ui){
      $el.find('.image-list').addClass('preventUpdate');
      reindexImages();
    });

    var reindexImages = function(){
      var $images = $el.find('.image-list').find('li');
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
  };


  StoryView.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    this.adjustIndexerButtons();
    this.attachSorter();

    var story_id = this.model.get('id');
    var self     = this;

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

    // Create the images view
    var imagesView = new CollectionView({
      collection    : this.model.get('images'),
      tagName       : 'ul',
      className     : 'image-list',
      listSelector  : '.image-list',
      itemView      : ImageView,
      container     : $(this.el).find('.image-list-container')
    });

    // Listen for updates, but only rerender if allowed
    var resortable = true
    imagesView.listenTo(this.model.get('images'), 'change', function(model){
      if(!$(self.el).find('.image-list').hasClass('preventUpdate')){
        self.model.get('images').sort();
        imagesView.renderAllItems();
      }
    });
  };


  return StoryView;
});