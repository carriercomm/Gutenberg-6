define([
  'chaplin',
  'handlebars',
  'wysiwyg',
  'uploader',
  'views/base/view',
  'views/images-view',
  'text!templates/story.hbs',
  'text!templates/text-editor.hbs',
  'text!templates/uploader.hbs',
  'text!templates/uploader-dumb.hbs'
], function(Chaplin, Handlebars, Wysiwyg, Uploader, View, ImagesView, storyTemplate, textEditorTemplate, uploaderTemplate, dumbUploaderTemplate){
  'use strict';

  var view = View.extend({
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


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.modelUpdate);
  };


  view.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  view.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  view.prototype.checkboxChanged = function(e){
    this.scheduleSave();
  };


  view.prototype.handleSort = function(e){
    e.preventDefault();

    var direction = 'up';
    if($(e.target).hasClass('down')) direction = 'down'

    Chaplin.mediator.publish('story_index_update', this.model, direction);
  };


  view.prototype.destroy = function(e){
    e.preventDefault();
    Chaplin.mediator.publish('delete_story', this.model);
  };


  view.prototype.scheduleSave = function(e){
    var self = this;

    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.saveModel();
    }, 100);
  };


  view.prototype.saveModel = function(){
    var attrs = {}

    var $inputs = $(this.el).find('.story-editor').find('input, textarea');
    $.each($inputs, function(){
      var name = $(this).attr('name');
      var val  = $(this).val();

      if(($(this)[0].type) == 'checkbox') val = $(this).is(':checked');

      attrs[name] = val;
    });

    this.model.save(attrs);
  };


  // Whenever the model updates, update the corresponding input fields
  view.prototype.modelUpdate = function(model){
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


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    var self = this;
    this.attachUploader();

    // Append the editor view
    var editor = Handlebars.compile(textEditorTemplate);
    $(this.el).find('.editor-wrapper').append(editor(this.model.attributes));

    // Initialize the wysiwyg editor
    // Umm... wait till next tick i guess? Who knows
    setTimeout(function(){
      $(self.el).find('#editor-' + self.model.get('id')).wysiwyg({
        toolbarSelector : '#editor-toolbar-' + self.model.get('id')
      });
    });

    // Attach an on paste method to the editor
    var $editor = $(self.el).find('.editor');
    $editor[0].onpaste = function(e){
      var pasteContent = e.clipboardData.getData('text/html');
      if(pasteContent == '') pasteContent = e.clipboardData.getData('text/plain');
      var cleanContent = self.cleanHTML(pasteContent);

      $editor.html(cleanContent);
      return false
    };

    // Create the images view
    var imagesView = new ImagesView({
      collection  : this.model.get('images'),
      container   : $(this.el).find('.image-list-container')
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


  return view;
});