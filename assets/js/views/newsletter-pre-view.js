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
    },
    events        : {}
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.updateDomWithModel);
  };


  view.prototype.updateDomWithModel = function(model){

    var attrs = model.attributes
    var $wrapper = $(this.el).find('.newsletter-attrs');

    for(var key in attrs){
      var selector  = '.' + key;
      var $el       = $wrapper.find(selector);

      if($el.length && !$el.hasClass('preventUpdate')){
        $el.val(attrs[key]);
      }
    }
  };

  return view;
});