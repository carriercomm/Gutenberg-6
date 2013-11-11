define([
  'chaplin',
  'models/base/model',
  'handlebars',
  'wysiwyg',
  'uploader',
  'views/base/view',
  'views/images-view',
  'views/videos-view',
  'views/videoEdit-view',
  'text!templates/story-editor.hbs',
  'text!templates/text-editor.hbs',
  'text!templates/uploader.hbs'
], function(Chaplin, Model, Handlebars, Wysiwyg, Uploader, View, ImagesView, VideosView, 
  VideoEditView, storyTemplate, textEditorTemplate, uploaderTemplate){
  'use strict';

  var view = View.extend({
    className     : 'story',
    template      : storyTemplate,
    schedule      : {},
    events        : {
      'click .destroy'        : 'destroy',
      'click .sort-button'    : 'handleSort',
      'click .add-video'      : 'addVideo',
      'focus input, textarea, div[contenteditable=true]' : 'inputFocused',
      'blur input, textarea, div[contenteditable=true]'  : 'inputBlurred',
      'keyup .model-input'    : 'scheduleSave',
      'change input[type="checkbox"]' : 'checkboxChanged'
    },
    listen        : {
      'change model' : 'updateDomWithModel',
      'channels_registered mediator' : 'redrawChannels'
    }
  });


  view.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  view.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  view.prototype.checkboxChanged = function(e){
    // The only thing this does is ensure the model property is present
    this.model.set(e.target.name, false);
    this.scheduleSave();
  };


  view.prototype.handleSort = function(e){
    e.preventDefault();

    var direction = 'up';
    if($(e.target).hasClass('down')) direction = 'down'

    this.publishEvent('story_index_update', this.model, direction);
  };


  view.prototype.destroy = function(e){
    e.preventDefault();
    var confirm = window.confirm('Are you sure you want to delete this story? All corresponding images will also be deleted. This data is not recoverable!');
    if(confirm) this.publishEvent('delete_story', this.model);
  };


  view.prototype.redrawChannels = function(channels){

    var $channels = $(this.el).find('.channel_selectors');

    for(var i=0; i<channels.length; i++){
      var namespace = 'in_channel_' + channels[i].title;
      var checked   = '';
      if(this.model.get(namespace)) checked = 'checked'

      var template  = "<label class='pull-right'>" +
        "Include Story in " + channels[i].title + "?" +
        "<input type='checkbox' " + checked + " class='" + namespace + "' name='" + namespace + "'>"
      "</label>";

      //$channels.append(template)
    }

  };


  view.prototype.scheduleSave = function(e){
    var self = this;

    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.saveModel();
    }, 100);
  };


  view.prototype.saveModel = function(){
    var self  = this;
    var attrs = {};

    for(var key in this.model.attributes){
      var selector  = '.' + key;
      var $el       = $(self.el).find(selector);

      if($el.length){
        // If some kind of form element, get the val
        if($el[0].nodeName == 'INPUT' || $el[0].nodeName == 'TEXTAREA'){
          if($el.attr('type') == 'checkbox'){
            attrs[key] = $el.prop('checked');
          } else {
            attrs[key] = $el.val();
          }
        } else {
          // If a regular element, get the html
          attrs[key] = $el.html();
        }
      }
    }

    this.model.save(attrs);
  };


  // Whenever the model updates, update the corresponding input fields
  view.prototype.updateDomWithModel = function(model){
    var self  = this;
    var attrs = model.attributes

    for(var key in attrs){
      var selector  = '.' + key;
      var $el       = $(self.el).find(selector);

      if($el.length && !$el.hasClass('preventUpdate')){
        // If some kind of form element, set the val
        if($el[0].nodeName == 'INPUT' || $el[0].nodeName == 'TEXTAREA'){
          if($el.attr('type') == 'checkbox'){
            attrs[key] ? $el.prop('checked', true) : $el.prop('checked', false)
          } else $el.val(attrs[key]);
        } else {
          // If a regular element, set the html
          $el.html(attrs[key]);
        }
      }
    }
  };


  // Optionally setup FineUploader if the module is loaded
  view.prototype.attachUploader = function(){
    var story_id = this.model.get('id');

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
  };


  // Create the wysiwyg editor and everything that goes with it
  view.prototype.attachEditor = function(){
    var self = this;
    var editor = Handlebars.compile(textEditorTemplate);
    $(this.el).find('.editor-wrapper').append(editor(this.model.attributes));

    // Umm... wait till next tick i guess? Who knows
    // Attaches the actual wysiwyg
    setTimeout(function(){
      $(self.el).find('#editor-' + self.model.get('id')).wysiwyg({
        toolbarSelector : '#editor-toolbar-' + self.model.get('id')
      });
    });

    // When clicking the link button, auto select the input field
    var $toolbar = $(this.el).find('#editor-toolbar-' + this.model.get('id'));
    $toolbar.find('.link-button').click(function(){
      var selfie = $(this);
      setTimeout(function(){
        $(selfie).parent().parent().addClass('open');
        $(selfie).parent().find('input').focus();
      }, 10);
    });

    // Close the dropdown menu if hitting the enter key
    $toolbar.find('input').bind('keydown', function(e){
      if(e.keyCode == 13) $(e.target).parent().parent().removeClass('open');
    });

    // Attach an on paste method to the editor
    var $editor = $(this.el).find('.editor');
    $editor[0].onpaste = function(e){
      var pasteContent = e.clipboardData.getData('text/html');
      if(pasteContent == '') pasteContent = e.clipboardData.getData('text/plain');
      var cleanContent = self.cleanHTML(pasteContent);

      $editor.html(cleanContent);
      return false
    };
  };


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    this.attachUploader();
    this.attachEditor();

    if(this.model.collection.channels) this.redrawChannels(this.model.collection.channels);

    // Create the images view
    var imagesView = new ImagesView({
      collection  : this.model.get('images'),
      container   : $(this.el).find('.image-list-container')
    });

    var videosView = new VideosView({
      collection  : this.model.get('videos'),
      container   : $(this.el).find('.video-list-container')
    });
  };


  // Pasting from Microsoft word is an ABSOLUTE DISASTER
  // this method removes the endless gobs of garbage produced
  // by the world's worst, yet most popular, text editor
  var allowedTags = ['A', 'DIV', 'SPAN', 'B', 'I', 'EM', 'STRONG', 'P'];
  view.prototype.cleanHTML = function(htmlString){

    // If it doesn't look like a tag, return the string
    if(htmlString.charAt(0) != '<') return htmlString
    try{ $(htmlString) }
    catch(e){ return htmlString }

    var self  = this;
    var $html = $(htmlString);
    var clean = '';

    $html.each(function(){
      if(allowedTags.indexOf(this.nodeName) != -1){
        var innards = self.cleanHTML($(this).html());
        // Create a special template for A tags
        if(this.nodeName == 'A'){
          var href = $(this).attr('href');
          var template = '<' + this.nodeName + ' href="' + href + '">' + innards + '</' + this.nodeName + '>';
        } else {
          var template = '<' + this.nodeName + '>' + innards + '</' + this.nodeName + '>';
        }
        
        clean += template
      }
    });

    return clean;
  };


  view.prototype.addVideo = function(){
    var video       = new Model({ 'story_id' : this.model.get('id') });
    video.url       = '/video/create';

    var videoModal  = new VideoEditView({
      model         : video,
      autoRender    : true,
      region        : 'main',
      className     : 'modal'
    });
  }

  return view;
});