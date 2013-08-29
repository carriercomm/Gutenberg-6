define([
  'chaplin',
  'views/base/view',
  'text!templates/publication.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    regions   : {
      'published'     : '#published-newsletters',
      'unpublished'   : '#unpublished-newsletters'
    }
  });

  return view;
});