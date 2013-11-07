define([
  'chaplin',
  'views/base/view',
  'text!templates/image.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template      : template,
    className     : 'image-container',
    events        : {
      'click .delete' : 'deleteImage'
    }
  });

  view.prototype.deleteImage = function(e) {
    Chaplin.View.prototype.render.apply(this, arguments);
    e.preventDefault();

    var id = $(e.target).data('id');
    var earl = '/image/destroy/' + id;

    $.ajax({ url : '/image/destroy/' + id });
  };

  return view;
});