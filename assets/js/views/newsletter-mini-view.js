define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterMini.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    tagName       : 'a',
    className     : 'list-group-item',
    template      : template,
    events        : {
      'click .destroy' : 'destroy'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    var earl = '/ui/newsletter/' + this.model.get('id');
    $(this.el).attr('href', earl);
  };


  view.prototype.destroy = function(e){
    e.preventDefault();
    e.stopPropagation();

    var confirm = window.confirm('Are you sure you want to delete this newsletter? All corresponding stories and images will also be deleted. This data is not recoverable!');
    if(confirm) this.model.destroy();
  };

  return view;
});