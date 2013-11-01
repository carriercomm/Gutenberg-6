define([
  'chaplin',
  'views/base/view',
  'text!templates/publication.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    attributes: {
      'id'    : 'publication'
    },
    regions   : {
      'newsletters' : '#newsletters',
      'users'       : '#users'
    }
  });

  return view;
});