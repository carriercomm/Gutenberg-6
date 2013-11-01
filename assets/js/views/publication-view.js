define([
  'chaplin',
  'views/base/view',
  'text!templates/publication.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    regions   : {
      'newsletters' : '#newsletters'
    },
    events    : {
      'click #add-newsletter' : 'createNewsletter'
    }
  });


  view.prototype.createNewsletter = function(e){
    e.preventDefault();
    this.publishEvent('create_newsletter', this.model);
  }

  return view;
});