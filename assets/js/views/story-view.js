define([
  'chaplin',
  'views/base/view',
  'text!templates/story.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    className     : 'story',
    template      : template
  });

  return view;
});