define([
  'chaplin',
  'ejs',
  'models/base/model',
  'views/base/view',
  'text!templates/newsletterPreview.hbs',
  'text!templates/newsletterPublish.hbs',
  'templates/helpers/getChannelHelpers'
], function(Chaplin, ejs, Model, View, newsletterTemplate, newsletterPublish, getChannelHelpers){
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
      'channels_registered mediator' : 'registerTemplates'
    },
    events        : {
      'click .controls' : 'toggleHelpers'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    $(this.el).find('iframe').attr('src', this.options.iframeURL);

    // Just make sure the render is done
    var self = this;
    setTimeout(function(){
      self.setIFrameHeight();
    });
  };


  view.prototype.registerTemplates = function(channels){
    var index         = this.options.params.templateIndex;
    var template      = channels[index].templates.publish || channels[index].templates.preview;
    this.userTemplate = ejs.compile(template);
    this.channels     = channels;
    this.render();
  };


  view.prototype.publish = function(){
    // Find the correct channel and then get all stories
    var activeChannel = _.findWhere(this.channels, { active : true });
    var stories       = this.collection.getSortedStoriesWithImages(activeChannel.title);

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
  }

  return view;
});