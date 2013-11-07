define([
  'chaplin',
  'views/base/view',
  'stickit',
  'text!templates/publicationMini.hbs'
], function(Chaplin, View, stickit, template){
  'use strict';

  var MiniView = View.extend({
    className : 'list-group-item',
    template  : template
  });

  return MiniView;
});