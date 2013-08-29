define([
  'chaplin',
  'views/base/view',
  'text!templates/publication.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    className : 'row',
    template  : template
  });

  return view;
});