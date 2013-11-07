define([
  'views/base/view',
  'text!templates/image.hbs'
], function(View, template){
  'use strict';

  var view = View.extend({
    template      : template,
    className     : 'image-container'
  });

  return view;
});