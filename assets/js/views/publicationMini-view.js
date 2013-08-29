define([
  'chaplin',
  'views/base/view',
  'text!templates/publicationMini.hbs'
], function(Chaplin, View, template){
  'use strict';

  var MiniView = View.extend({
    className : 'list-group-item',
    template  : template
  });

  return MiniView;
});