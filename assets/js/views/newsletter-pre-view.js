define([
  'chaplin',
  'ejs',
  'models/base/model',
  'views/base/view',
  'text!templates/newsletterPreview.hbs',
  'text!templates/newsletterPublish.hbs',
  'templates/helpers/channelHelpersExist',
  'templates/helpers/getChannelHelpers'
], function(Chaplin, ejs, Model, View, newsletterTemplate, newsletterPublish, channelHelpersExist, getChannelHelpers){
  'use strict';

  var view = View.extend({
    template      : newsletterTemplate,
    attributes    : {
      'id'        : 'newsletter-pre-view'
    },
    regions       : {
      'stories'   : '#stories',
      'nav'       : '#nav-container'
    },
    listen        : {
      'channels_registered mediator'  : 'registerTemplates',
      'change model'                  : 'updateTemplateHelperAttrs'
    },
    events        : {
      'click #publish'                : 'publish',
      'click .controls'               : 'toggleHelpers',
      'focus input'                   : 'inputFocused',
      'blur input'                    : 'inputBlurred',
      'keyup .template-helpers'       : 'scheduleSave',
      'change input[type="checkbox"]' : 'checkboxChanged'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    $(this.el).find('iframe').attr('src', this.options.iframeURL);

    var href = '/ui/preview/' + this.model.get('id') + window.location.search;
    $(this.el).find('#new_tab').attr('href', href);

    // Just make sure the render is done
    var self = this;
    setTimeout(function(){
      self.setIFrameHeight();
      self.publishEvent('newsletter_rendered');
    });
  };


  view.prototype.registerTemplates = function(channels){
    var index         = this.options.params.templateIndex;
    var template      = channels[index].templates.publish || channels[index].templates.preview;
    this.userTemplate = ejs.compile(template);
    this.channels     = channels;
    this.render();
    this.updateTemplateHelperAttrs(this.model);
  };


  view.prototype.publish = function(){
    // Find the correct channel and then get all stories
    var activeChannel = _.findWhere(this.channels, { active : true });
    var stories       = this.collection.prepForTemplateUsage(activeChannel.title);

    // Generate the html for the publish view
    var html          = this.userTemplate({
      stories         : stories,
      newsletter      : this.model.prepForTemplateUsage()
    });

    // Create a temporary model for template usage
    var publishedModel = new Model(this.model.attributes);
    publishedModel.set('renderedHTML', html);

    // Create a pop up for the copy/paste textarea
    var modal   = View.extend({
      className : 'modal',
      template  : newsletterPublish
    });

    // Render the pop up
    var modal    = new modal({
      autoRender : true,
      region     : 'main',
      model      : publishedModel,
      attributes : {
        'id'     : 'newsletter-publish'
      }
    });

    // Open the pop up
    $('#newsletter-publish').modal();
    $('#newsletter-publish').on('hidden.bs.modal', function(){
      $('#newsletter-publish').remove();
    });
  };


  // This is just an approximation, but because this design is simple
  // it seems to work pretty well
  view.prototype.setIFrameHeight = function(){
    var els = ['#nav-container', '#site-navigation', '#publish-buttons'];
    var height = $(window).height();

    for(var i=0; i<els.length; i++){
      height -= $(els[i]).height();
    }
    height -= 50;

    $(this.el).find('iframe').height(height);
  };


  view.prototype.toggleHelpers = function(){
    $(this.el).find('.options').slideToggle();
    $(this.el).find('.template-helpers').toggleClass('hidden-content');
  };


  view.prototype.inputFocused = function(e){
    $(e.target).addClass('preventUpdate');
  };


  view.prototype.inputBlurred = function(e){
    $(e.target).removeClass('preventUpdate');
  };


  view.prototype.checkboxChanged = function(e){
    this.model.set(e.target.name, false);
    this.scheduleSave();
  };


  view.prototype.scheduleSave = function(e){
    var self = this;

    clearTimeout(this.schedule);
    this.schedule = setTimeout(function(){
      self.saveTemplateHelperAttrs();
    }, 100);
  };


  view.prototype.saveTemplateHelperAttrs = function(){
    var self  = this;
    var attrs = {};

    var helperInputs = $(this.el).find('.template-helper');
    $.each(helperInputs, function(){
      var $el = $(this);
      var key = $el.data('helper-id');

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
    });

    this.model.save(attrs);
  };


  // Whenever the model updates, update the corresponding input fields
  view.prototype.updateTemplateHelperAttrs = function(model){
    var self  = this;
    var attrs = model.attributes

    for(var key in attrs){
      var selector  = '[data-helper-id=' + key + ']';
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



  return view;
});