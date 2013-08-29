define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletters.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    className   : 'panel panel-default',
    template    : template,
    regions     : {
      'published'   : '#published-newsletters',
      'unpublished' : '#unpublished-newsletters'
    }
  });

  return view;
});