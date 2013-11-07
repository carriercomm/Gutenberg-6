define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterPreview.hbs'
], function(Chaplin, View, newsletterTemplate){
  'use strict';

  var view = View.extend({
    template      : newsletterTemplate,
    attributes    : {
      'id'        : 'newsletter-pre-view'
    },
    regions       : {
      'stories'   : '#stories',
      'nav'       : '#nav-container'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    $(this.el).find('iframe').attr('src', this.options.iframeURL);
  };


  return view;
});